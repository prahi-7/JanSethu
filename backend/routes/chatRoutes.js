const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Get message history for a team
router.get('/history/:teamId', auth, chatController.getMessageHistory);

// Get messages with pagination
router.get('/messages/:teamId', auth, chatController.getMessages);

// Mark messages as read
router.put('/messages/read', auth, chatController.markAsRead);

// Get unread count
router.get('/unread/:teamId', auth, chatController.getUnreadCount);

module.exports = router;