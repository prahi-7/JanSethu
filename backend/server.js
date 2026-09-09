require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const connectDB = require('./config/database');
const configureCors = require('./config/cors');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const problemRoutes = require('./routes/problemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const governmentRoutes = require('./routes/governmentRoutes');
const industryRoutes = require('./routes/industryRoutes');
const universityRoutes = require('./routes/universityRoutes');
const studentRoutes = require('./routes/studentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const escalationRoutes = require('./routes/escalationRoutes');

// Initialize express app
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// ============================================
// SOCKET.IO INTEGRATION
// ============================================
const socketIO = require('socket.io');
const { verifyToken } = require('./config/jwt');
const Message = require('./models/Message');
const Team = require('./models/Team');
const User = require('./models/User');

// Helper function to find team by ID or Name (for Socket.IO)
const findTeamByIdOrName = async (teamId) => {
  let team = null;
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(teamId);
  
  if (isValidObjectId) {
    team = await Team.findById(teamId);
  }
  
  if (!team) {
    const escapedName = teamId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    team = await Team.findOne({ 
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') } 
    });
  }
  
  if (!team) {
    const escapedName = teamId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    team = await Team.findOne({ 
      name: { $regex: new RegExp(escapedName, 'i') } 
    });
  }
  
  return team;
};

const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user;
    socket.userId = user._id;
    next();
  } catch (error) {
    console.error('Socket auth error:', error);
    next(new Error('Authentication error: ' + error.message));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userId} (${socket.user.name})`);

  // Join a team room (by ID or Name)
  socket.on('join-room', async (data) => {
    const { teamId } = data;
    if (!teamId) return;

    try {
      console.log('🔍 Socket join-room for:', teamId);
      
      const team = await findTeamByIdOrName(teamId);
      
      if (!team) {
        socket.emit('error', { message: `Team "${teamId}" not found` });
        return;
      }

      // Check if user is a member
      if (!team.members.includes(socket.userId)) {
        socket.emit('error', { message: 'You are not a member of this team' });
        return;
      }

      const roomId = `team-${team._id}`;
      socket.join(roomId);
      socket.teamId = team._id;
      socket.teamName = team.name;
      
      console.log(`User ${socket.userId} joined team "${team.name}" (${team._id})`);
      
      // Send recent message history
      const messages = await Message.find({ team: team._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('sender', 'name email')
        .lean();

      socket.emit('message-history', {
        teamId: team._id,
        teamName: team.name,
        messages: messages.reverse()
      });

      // Notify others
      socket.to(roomId).emit('user-joined', {
        userId: socket.userId,
        name: socket.user.name,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Leave a team room
  socket.on('leave-room', (data) => {
    const { teamId } = data;
    if (teamId) {
      const roomId = `team-${teamId}`;
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', {
        userId: socket.userId,
        name: socket.user.name,
        timestamp: new Date()
      });
      console.log(`User ${socket.userId} left team ${teamId}`);
    }
  });

  // Send a message
  socket.on('send-message', async (data) => {
    try {
      const { teamId, content } = data;
      
      if (!teamId || !content || !content.trim()) {
        socket.emit('error', { message: 'Invalid message' });
        return;
      }

      // Find team by ID or Name
      const team = await findTeamByIdOrName(teamId);
      
      if (!team) {
        socket.emit('error', { message: `Team "${teamId}" not found` });
        return;
      }

      // Verify team membership
      if (!team.members.includes(socket.userId)) {
        socket.emit('error', { message: 'You are not a member of this team' });
        return;
      }

      // Save message to database
      const message = new Message({
        team: team._id,
        sender: socket.userId,
        content: content.trim()
      });
      await message.save();

      // Populate sender info
      await message.populate('sender', 'name email');

      // Emit to all users in the room (including sender)
      const roomId = `team-${team._id}`;
      io.to(roomId).emit('receive-message', {
        _id: message._id,
        team: message.team,
        sender: {
          _id: message.sender._id,
          name: message.sender.name,
          email: message.sender.email
        },
        content: message.content,
        createdAt: message.createdAt,
        isOwn: false
      });

      console.log(`Message sent in team "${team.name}" by ${socket.user.name}`);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { teamId, isTyping } = data;
    if (teamId) {
      const roomId = `team-${teamId}`;
      socket.to(roomId).emit('user-typing', {
        userId: socket.userId,
        name: socket.user.name,
        isTyping: isTyping || false
      });
    }
  });

  // Mark messages as read
  socket.on('mark-read', async (data) => {
    try {
      const { teamId, messageIds } = data;
      if (!teamId || !messageIds || !messageIds.length) return;

      const team = await findTeamByIdOrName(teamId);
      
      if (!team) return;

      await Message.updateMany(
        { 
          _id: { $in: messageIds },
          team: team._id,
          sender: { $ne: socket.userId },
          readBy: { $ne: socket.userId }
        },
        { $addToSet: { readBy: socket.userId } }
      );
    } catch (error) {
      console.error('Mark read error:', error);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
    if (socket.teamId) {
      const roomId = `team-${socket.teamId}`;
      socket.to(roomId).emit('user-left', {
        userId: socket.userId,
        name: socket.user.name,
        timestamp: new Date()
      });
    }
  });
});

// Make io accessible to routes
app.set('io', io);
// ============================================
// SOCKET.IO INTEGRATION - END
// ============================================

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: "cross-origin" }, 
  contentSecurityPolicy: false 
}));
app.use(configureCors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(generalLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin/escalations', escalationRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'JanSetu Backend API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      problems: '/api/problems',
      admin: '/api/admin',
      government: '/api/government',
      student: '/api/student',
      chat: '/api/chat',
      upload: '/api/upload'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found', 
    path: req.path 
  });
});

// Global error handler
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 JanSetu Backend running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
  logger.info(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  logger.info(`🔌 Socket.IO ready`);
});

// Graceful shutdown
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = { app, server, io };