const User = require('../models/User');
const Problem = require('../models/Problem');
const ProblemTimeline = require('../models/ProblemTimeline');
const { HTTP_STATUS, MESSAGES,PROBLEM_STATUSES} = require('../utils/constants');
const { formatResponse, paginate, getPaginationResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

// Get admin dashboard statistics
const getStats = async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get problem statistics
    const problemStats = await Problem.getStats();
    const categoryDistribution = await Problem.getCategoryDistribution();
    const priorityDistribution = await Problem.getPriorityDistribution();

    // Get recent activity
    const recentProblems = await Problem.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('citizen', 'name email');

    const recentTimeline = await ProblemTimeline.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('changedBy', 'name email role');

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        byRole: userStats
      },
      problems: problemStats,
      categories: categoryDistribution,
      priorities: priorityDistribution,
      recent: {
        problems: recentProblems,
        activity: recentTimeline
      },
      timestamp: new Date()
    };

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Dashboard statistics fetched successfully', stats)
    );

  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

// Get all users (with filters)
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const { page: pageNum, limit: limitNum, skip } = paginate(page, limit);
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query)
    ]);

    const result = getPaginationResponse(total, pageNum, limitNum, users);

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Users fetched successfully', result)
    );

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, MESSAGES.USER_NOT_FOUND, null, ['User not found'])
      );
    }

    // Get user's problems
    const problems = await Problem.find({ citizen: id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'User fetched successfully', { user, problems })
    );

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

// Update user (admin)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const allowedUpdates = ['name', 'role', 'isActive', 'phone', 'address', 'university', 'department', 'year', 'skills', 'organization', 'designation', 'expertise', 'govDepartment'];
    
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, MESSAGES.USER_NOT_FOUND, null, ['User not found'])
      );
    }

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, MESSAGES.USER_UPDATED, { user })
    );

  } catch (error) {
    logger.error('Update user error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

// Delete user (admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, MESSAGES.USER_NOT_FOUND, null, ['User not found'])
      );
    }

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'User deleted successfully')
    );

  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};

// Get admin problem list
const getAdminProblems = async (req, res) => {
  try {
    const { category, status, priority, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const { page: pageNum, limit: limitNum, skip } = paginate(page, limit);
    
    const [problems, total] = await Promise.all([
      Problem.find(query)
        .populate('citizen', 'name email role')
        .populate('assignedTo', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Problem.countDocuments(query)
    ]);

    const result = getPaginationResponse(total, pageNum, limitNum, problems);

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Problems fetched successfully', result)
    );

  } catch (error) {
    logger.error('Get admin problems error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, MESSAGES.INTERNAL_ERROR, null, [error.message])
    );
  }
};
// Delete problem (admin)
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(
          false,
          'Problem not found',
          null,
          ['Problem not found']
        )
      );
    }

    await Problem.findByIdAndDelete(id);

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Problem deleted successfully'
      )
    );

  } catch (error) {
    logger.error('Delete problem error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};

const updateProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    if (!status) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(
          false,
          'Status is required',
          null,
          ['Please provide a valid status']
        )
      );
    }

    // Make sure the status is one of the allowed Problem statuses
    if (!PROBLEM_STATUSES.includes(status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(
          false,
          'Invalid problem status',
          null,
          [`Allowed statuses: ${PROBLEM_STATUSES.join(', ')}`]
        )
      );
    }

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(
          false,
          'Problem not found',
          null,
          ['Problem not found']
        )
      );
    }

    // Update status + create timeline entry
    await problem.updateStatus(
      status,
      req.userId,
      comment || `Problem status changed to ${status} by admin`
    );

    // If the problem is solved, store resolution information
    if (status === 'Solved') {
      problem.resolution = {
        ...(problem.resolution?.toObject
          ? problem.resolution.toObject()
          : problem.resolution || {}),
        date: new Date(),
        solvedBy: req.userId
      };

      await problem.save();
    }

    const updatedProblem = await Problem.findById(id)
      .populate('citizen', 'name email')
      .populate('assignedTo', 'name email role');

    return res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Problem status updated successfully',
        updatedProblem
      )
    );

  } catch (error) {
    logger.error('Update problem status error:', error);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};

module.exports = {
  getStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminProblems,
  deleteProblem,
  updateProblemStatus
};