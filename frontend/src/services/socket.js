import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token, userId) {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  joinRoom(teamId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-room', { teamId });
      console.log(`Joined room: team-${teamId}`);
    } else {
      console.warn('Socket not connected, cannot join room');
    }
  }

  leaveRoom(teamId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-room', { teamId });
      console.log(`Left room: team-${teamId}`);
    }
  }

  sendMessage(teamId, content) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', { teamId, content });
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  }

  setTyping(teamId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { teamId, isTyping });
    }
  }

  markAsRead(teamId, messageIds) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark-read', { teamId, messageIds });
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }
}

const socketService = new SocketService();
export default socketService;