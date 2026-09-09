const Message = require('../models/Message');
const Team = require('../models/Team');
const { HTTP_STATUS } = require('../utils/constants');
const { formatResponse, paginate, getPaginationResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

// Helper function to find team by ID or Name
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

// Get message history for a team (by ID or Name)
const getMessageHistory = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { limit = 50 } = req.query;

    console.log('🔍 Chat history for:', teamId);

    const team = await findTeamByIdOrName(teamId);
    
    if (!team) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, `Team "${teamId}" not found`, null, ['Team not found'])
      );
    }

    // Check if user is member
    if (!team.members.includes(req.userId)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        formatResponse(false, 'Access denied', null, ['You are not a member of this team'])
      );
    }

    // Get messages
    const messages = await Message.find({ team: team._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('sender', 'name email')
      .lean();

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Message history fetched', {
        teamId: team._id,
        teamName: team.name,
        messages: messages.reverse()
      })
    );

  } catch (error) {
    logger.error('Get message history error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Internal server error', null, [error.message])
    );
  }
};

// Get messages with pagination
const getMessages = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const team = await findTeamByIdOrName(teamId);
    
    if (!team) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, `Team "${teamId}" not found`, null, ['Team not found'])
      );
    }

    if (!team.members.includes(req.userId)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        formatResponse(false, 'Access denied', null, ['You are not a member of this team'])
      );
    }

    const { page: pageNum, limit: limitNum, skip } = paginate(page, limit);
    
    const [messages, total] = await Promise.all([
      Message.find({ team: team._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('sender', 'name email')
        .lean(),
      Message.countDocuments({ team: team._id })
    ]);

    const result = getPaginationResponse(total, pageNum, limitNum, messages.reverse());

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Messages fetched', result)
    );

  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Internal server error', null, [error.message])
    );
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !messageIds.length) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, 'Message IDs required', null, ['Please provide message IDs'])
      );
    }

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        sender: { $ne: req.userId },
        readBy: { $ne: req.userId }
      },
      { $addToSet: { readBy: req.userId } }
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Messages marked as read')
    );

  } catch (error) {
    logger.error('Mark as read error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Internal server error', null, [error.message])
    );
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await findTeamByIdOrName(teamId);
    
    if (!team) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, `Team "${teamId}" not found`, null, ['Team not found'])
      );
    }

    const count = await Message.countDocuments({
      team: team._id,
      sender: { $ne: req.userId },
      readBy: { $ne: req.userId }
    });

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Unread count fetched', { count })
    );

  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Internal server error', null, [error.message])
    );
  }
};

module.exports = {
  getMessageHistory,
  getMessages,
  markAsRead,
  getUnreadCount
};