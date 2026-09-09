const User = require('../models/User');
const Project = require('../models/Project');
const Problem = require('../models/Problem');
const { HTTP_STATUS } = require('../utils/constants');
const { formatResponse, paginate, getPaginationResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

// Get university dashboard
const getDashboard = async (req, res) => {
  try {
    const universityName = req.user.university;

    // Get students from this university
    const students = await User.find({
      role: 'student',
      university: universityName
    })
      .select('name email department year skills')
      .limit(20);

    // Get projects from this university
    const projects = await Project.find({ university: universityName })
      .populate('problem', 'title category status')
      .populate('team', 'name members')
      .sort({ createdAt: -1 })
      .limit(10);

    const dashboard = {
      students,
      projects,
      timestamp: new Date()
    };

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'University dashboard fetched successfully', dashboard)
    );

  } catch (error) {
    logger.error('Get university dashboard error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Internal server error', null, [error.message])
    );
  }
};


// Get students
const getStudents = async (req, res) => {
  try {
    const universityName = req.user.university;
    const { department, year, search, page = 1, limit = 20 } = req.query;

    const query = {
      role: 'student',
      university: universityName
    };

    if (department) query.department = department;
    if (year) query.year = year;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const { page: pageNum, limit: limitNum, skip } = paginate(page, limit);

    const [students, total] = await Promise.all([
      User.find(query)
        .select('name email department year skills isActive')
        .skip(skip)
        .limit(limitNum),

      User.countDocuments(query)
    ]);

    const result = getPaginationResponse(
      total,
      pageNum,
      limitNum,
      students
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Students fetched successfully', result)
    );

  } catch (error) {
    logger.error('Get students error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Internal server error', null, [error.message])
    );
  }
};


// Get citizen problems for university
const getCitizenProblems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      search
    } = req.query;

    const query = {};

    // Optional filters
    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

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
        .populate('citizen', 'name email')
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
        'Citizen problems fetched successfully',
        result
      )
    );

  } catch (error) {
    logger.error('Get citizen problems error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


module.exports = {
  getDashboard,
  getStudents,
  getCitizenProblems
};