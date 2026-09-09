const Problem = require('../models/Problem');
const User = require('../models/User');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const {
  formatResponse,
  paginate,
  getPaginationResponse
} = require('../utils/helpers');
const logger = require('../utils/logger');

// Get government dashboard statistics
const getDashboard = async (req, res) => {
  try {
    // Get problem statistics by department
    const departmentStats = await Problem.aggregate([
      {
        $group: {
          _id: '$assignedDepartment',
          total: { $sum: 1 },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
            }
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0]
            }
          },
          solved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get urgent problems
    const urgentProblems = await Problem.find({
      priority: 'Urgent',
      status: { $ne: 'Solved' }
    })
      .populate('citizen', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(20);

    // Get category statistics
    const categoryStats = await Problem.getCategoryDistribution();

    const dashboard = {
      departmentStats,
      urgentProblems,
      categoryStats,
      timestamp: new Date()
    };

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Government dashboard fetched successfully',
        dashboard
      )
    );
  } catch (error) {
    logger.error('Get government dashboard error:', error);

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

// Get government problem list
const getGovernmentProblems = async (req, res) => {
  try {
    const {
      category,
      status,
      priority,
      department,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (department) query.assignedDepartment = department;

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: search,
            $options: 'i'
          }
        }
      ];
    }

    const {
      page: pageNum,
      limit: limitNum,
      skip
    } = paginate(page, limit);

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .populate('citizen', 'name email phone address')
        .populate('assignedTo', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Problem.countDocuments(query)
    ]);

    const result = getPaginationResponse(
      total,
      pageNum,
      limitNum,
      problems
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Problems fetched successfully',
        result
      )
    );
  } catch (error) {
    logger.error('Get government problems error:', error);

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

// Get government statistics
const getGovernmentStats = async (req, res) => {
  try {
    // Get overall statistics
    const totalProblems = await Problem.countDocuments();

    const solvedProblems = await Problem.countDocuments({
      status: 'Solved'
    });

    const pendingProblems = await Problem.countDocuments({
      status: {
        $in: ['Pending', 'Under Review', 'In Progress']
      }
    });

    // IMPORTANT:
    // Count actual Escalated problems by STATUS,
    // not Urgent problems by PRIORITY.
    const escalatedProblems = await Problem.countDocuments({
      status: 'Escalated'
    });

    // Get department performance
    const departmentPerformance = await Problem.aggregate([
      {
        $match: {
          assignedDepartment: {
            $exists: true,
            $ne: null
          }
        }
      },
      {
        $group: {
          _id: '$assignedDepartment',

          total: {
            $sum: 1
          },

          solved: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'Solved'] },
                1,
                0
              ]
            }
          },

          inProgress: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'In Progress'] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          department: '$_id',
          total: 1,
          solved: 1,
          inProgress: 1,

          completionRate: {
            $multiply: [
              {
                $divide: [
                  '$solved',
                  '$total'
                ]
              },
              100
            ]
          }
        }
      }
    ]);

    const stats = {
      overview: {
        total: totalProblems,
        solved: solvedProblems,
        pending: pendingProblems,

        // Kept for compatibility with the existing frontend.
        // Escalated is now the actual escalated status count.
        urgent: 0,
        escalated: escalatedProblems,

        completionRate:
          totalProblems > 0
            ? (solvedProblems / totalProblems) * 100
            : 0
      },

      departmentPerformance,

      timestamp: new Date()
    };

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Government statistics fetched successfully',
        stats
      )
    );
  } catch (error) {
    logger.error('Get government stats error:', error);

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
// Get a single government problem by ID
const getGovernmentProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        formatResponse(false, 'Invalid problem ID')
      );
    }

    const problem = await Problem.findById(id)
      .populate('citizen', 'name email phone address')
      .populate('assignedTo', 'name email role');

    if (!problem) {
      return res.status(404).json(
        formatResponse(false, 'Problem not found')
      );
    }

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Problem fetched successfully',
        { problem }
      )
    );
  } catch (error) {
    logger.error(
      'Get government problem by ID error:',
      error
    );

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



module.exports = {
  getDashboard,
  getGovernmentProblems,
  getGovernmentStats,
  getGovernmentProblemById
};