const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { HTTP_STATUS, MESSAGES, USER_ROLES } = require('../utils/constants');
const { formatResponse, sanitizeUser } = require('../utils/helpers');
const logger = require('../utils/logger');

const register = async (req, res) => {
  try {
    const { name, email, password, role, ...additionalFields } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json(
        formatResponse(false, MESSAGES.USER_EXISTS, null, ['User with this email already exists'])
      );
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role: role || USER_ROLES.CITIZEN,
      ...additionalFields
    };

    if (role === USER_ROLES.STUDENT && !additionalFields.university) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, 'University is required for students', null, ['University field is required'])
      );
    }

    if (role === USER_ROLES.INDUSTRY && !additionalFields.organization) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, 'Organization is required for industry users', null, ['Organization field is required'])
      );
    }

    const user = new User(userData);
    await user.save();

    const token = generateToken(user._id, user.role);
    const userResponse = sanitizeUser(user);

    res.status(HTTP_STATUS.CREATED).json(
      formatResponse(true, MESSAGES.USER_CREATED, {
        user: userResponse,
        token
      })
    );

  } catch (error) {
    logger.error('Register error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatResponse(false, MESSAGES.AUTH_FAILED, null, ['Invalid email or password'])
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatResponse(false, MESSAGES.AUTH_FAILED, null, ['Invalid email or password'])
      );
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);
    const userResponse = sanitizeUser(user);

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, MESSAGES.AUTH_SUCCESS, {
        user: userResponse,
        token
      })
    );

  } catch (error) {
    logger.error('Login error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, MESSAGES.USER_NOT_FOUND, null, ['User not found'])
      );
    }

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'User fetched successfully', { user: sanitizeUser(user) })
    );

  } catch (error) {
    logger.error('GetMe error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'phone', 'address', 'university', 'department', 'year', 'skills', 'organization', 'designation', 'expertise', 'govDepartment', 'profileImage'];

    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, MESSAGES.USER_NOT_FOUND, null, ['User not found'])
      );
    }

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, MESSAGES.USER_UPDATED, { user: sanitizeUser(user) })
    );

  } catch (error) {
    logger.error('UpdateProfile error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

const logout = async (req, res) => {
  res.status(HTTP_STATUS.OK).json(
    formatResponse(true, 'Logged out successfully', null)
  );
};

const refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.userId, req.userRole);
    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Token refreshed successfully', { token })
    );
  } catch (error) {
    logger.error('RefreshToken error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
  refreshToken
};