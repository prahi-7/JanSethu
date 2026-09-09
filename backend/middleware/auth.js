const { verifyToken } = require('../config/jwt');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const { formatResponse } = require('../utils/helpers');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatResponse(false, MESSAGES.UNAUTHORIZED, null, ['No token provided'])
      );
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatResponse(false, MESSAGES.TOKEN_INVALID, null, ['Invalid token'])
      );
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatResponse(false, MESSAGES.USER_NOT_FOUND, null, ['User not found'])
      );
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

module.exports = auth;