const mongoose = require('mongoose');

const User = require('../models/User');
const Problem = require('../models/Problem');
const Project = require('../models/Project');

const { HTTP_STATUS } = require('../utils/constants');
const { formatResponse } = require('../utils/helpers');
const logger = require('../utils/logger');


// ============================================
// HELPER: FIND PROJECT USING OBJECTID OR NUMBER
// ============================================
// Supports:
// /industry/project/665abc123...  -> MongoDB _id
// /industry/project/1              -> first project
// /industry/project/2              -> second project
//
// Projects are ordered newest first.
// ============================================
const findProjectByFlexibleId = async (projectId) => {

  if (!projectId) {
    return null;
  }

  // ------------------------------------------
  // Normal MongoDB ObjectId
  // ------------------------------------------
  if (mongoose.Types.ObjectId.isValid(projectId)) {
    return await Project.findById(projectId);
  }

  // ------------------------------------------
  // Legacy numeric ID
  // Example: "1", "2", "3"
  // ------------------------------------------
  if (/^\d+$/.test(String(projectId))) {

    const numericId = Number(projectId);

    if (numericId < 1) {
      return null;
    }

    const projects = await Project.find({})
      .sort({ createdAt: -1 });

    // 1 = first project
    // 2 = second project
    // etc.
    return projects[numericId - 1] || null;
  }

  return null;
};


// ============================================
// INDUSTRY DASHBOARD
// ============================================
const getDashboard = async (req, res) => {
  try {

    const userId = req.userId;

    const user = await User.findById(userId)
      .select('name organization expertise');

    const projects = await Project.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    const dashboard = {
      user,
      projects,
      timestamp: new Date()
    };

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Industry dashboard fetched successfully',
        dashboard
      )
    );

  } catch (error) {

    logger.error(
      'Get industry dashboard error:',
      error
    );

    res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


// ============================================
// GET ALL STUDENT PROJECTS
// ============================================
const getProjects = async (req, res) => {
  try {

    const projects = await Project.find({})
      .sort({ createdAt: -1 });

    console.log(
      'Industry projects found:',
      projects.length
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Projects fetched successfully',
        { projects }
      )
    );

  } catch (error) {

    logger.error(
      'Get industry projects error:',
      error
    );

    res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


// ============================================
// GET SINGLE PROJECT
// ============================================
const getProjectById = async (req, res) => {
  try {

    const { projectId } = req.params;

    console.log(
      '🔎 Industry getProjectById:',
      projectId
    );

    // ------------------------------------------
    // Find project using ObjectId OR numeric ID
    // ------------------------------------------
    const project =
      await findProjectByFlexibleId(projectId);

    if (!project) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          'Project not found',
          null
        )
      );
    }

    // ------------------------------------------
    // Populate project information
    // ------------------------------------------
    await project.populate([
      {
        path: 'problem'
      },
      {
        path: 'team',
        populate: {
          path: 'members',
          select:
            'name email university department'
        }
      },
      {
        path: 'industryMentor',
        select:
          'name email organization expertise'
      },
      {
        path: 'fundedBy',
        select:
          'name email organization'
      }
    ]);

    console.log(
      '✅ Project found:',
      project._id
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Project fetched successfully',
        { project }
      )
    );

  } catch (error) {

    logger.error(
      'Get project by ID error:',
      error
    );

    res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


// ============================================
// GET SINGLE PROBLEM
// ============================================
const getProblemById = async (req, res) => {
  try {

    const { problemId } = req.params;

    if (
      !problemId ||
      !mongoose.Types.ObjectId.isValid(problemId)
    ) {

      return res.status(
        HTTP_STATUS.BAD_REQUEST
      ).json(
        formatResponse(
          false,
          'Invalid problem ID',
          null
        )
      );
    }

    const problem =
      await Problem.findById(problemId)
        .populate(
          'citizen',
          'name email'
        );

    if (!problem) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          'Problem not found',
          null
        )
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
      'Get problem by ID error:',
      error
    );

    res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


// ============================================
// GET INDUSTRY MENTORS
// ============================================
const getMentors = async (req, res) => {
  try {

    const mentors = await User.find({
      role: 'industry'
    })
      .select(
        'name email organization expertise role'
      )
      .sort({
        name: 1
      });

    console.log(
      '👥 Industry mentors found:',
      mentors.length
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Mentors fetched successfully',
        { mentors }
      )
    );

  } catch (error) {

    logger.error(
      'Get mentors error:',
      error
    );

    res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


// ============================================
// ADD / UPDATE MENTOR PROFILE
// ============================================
const addMentor = async (req, res) => {
  try {

    const { expertise } = req.body;
    const userId = req.userId;

    if (!userId) {

      return res.status(
        HTTP_STATUS.UNAUTHORIZED
      ).json(
        formatResponse(
          false,
          'User authentication required',
          null
        )
      );
    }

    const user =
      await User.findByIdAndUpdate(
        userId,
        {
          expertise: Array.isArray(expertise)
            ? expertise
            : []
        },
        {
          new: true
        }
      ).select(
        'name email organization expertise'
      );

    if (!user) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          'User not found',
          null
        )
      );
    }

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Mentor added successfully',
        { user }
      )
    );

  } catch (error) {

    logger.error(
      'Add mentor error:',
      error
    );

    res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


// ============================================
// ASSIGN MENTOR TO PROJECT
// ============================================
const assignMentor = async (req, res) => {
  try {

    const { projectId } = req.params;
    const { mentorId } = req.body;

    console.log('');
    console.log('================================');
    console.log('🔥 ASSIGN MENTOR REQUEST');
    console.log('Project ID:', projectId);
    console.log('Mentor ID:', mentorId);
    console.log('================================');

    // ------------------------------------------
    // Validate mentor ID
    // ------------------------------------------
    if (!mentorId) {

      return res.status(
        HTTP_STATUS.BAD_REQUEST
      ).json(
        formatResponse(
          false,
          'Mentor ID is required',
          null
        )
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(mentorId)
    ) {

      return res.status(
        HTTP_STATUS.BAD_REQUEST
      ).json(
        formatResponse(
          false,
          'Invalid mentor ID',
          null
        )
      );
    }

    // ------------------------------------------
    // Check mentor
    // ------------------------------------------
    const mentor =
      await User.findOne({
        _id: mentorId,
        role: 'industry'
      });

    if (!mentor) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          'Mentor not found',
          null
        )
      );
    }

    // ------------------------------------------
    // Find project
    // Supports both ObjectId and "1"
    // ------------------------------------------
    const project =
      await findProjectByFlexibleId(projectId);

    if (!project) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          'Project not found',
          null
        )
      );
    }

    // ------------------------------------------
    // Assign mentor
    // ------------------------------------------
    project.industryMentor =
      mentor._id;

    await project.save();

    // ------------------------------------------
    // Populate updated project
    // ------------------------------------------
    await project.populate([
      {
        path: 'industryMentor',
        select:
          'name email organization expertise'
      },
      {
        path: 'fundedBy',
        select:
          'name email organization'
      },
      {
        path: 'team'
      },
      {
        path: 'problem'
      }
    ]);

    console.log(
      '✅ Mentor assigned successfully'
    );

    console.log(
      'Assigned mentor:',
      project.industryMentor
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Mentor assigned successfully',
        { project }
      )
    );

  } catch (error) {

    console.error(
      '❌ ASSIGN MENTOR ERROR:',
      error
    );

    logger.error(
      'Assign mentor error:',
      error
    );

    res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


// ============================================
// COMMIT FUNDING
// ============================================
const commitFunding = async (req, res) => {
  try {

    const {
      projectId,
      amount,
      commitment,
      fundingType,
      description,
      timeline,
      transactionId,
      remarks
    } = req.body;

    const userId = req.userId;

    console.log('');
    console.log('================================');
    console.log('🔥 FUNDING REQUEST');
    console.log('Project ID:', projectId);
    console.log('Amount:', amount);
    console.log(
      'Funding Type:',
      fundingType
    );
    console.log('User ID:', userId);
    console.log('================================');

    // ------------------------------------------
    // Validate project ID
    // Supports ObjectId and numeric ID
    // ------------------------------------------
    if (!projectId) {

      return res.status(
        HTTP_STATUS.BAD_REQUEST
      ).json(
        formatResponse(
          false,
          'Project ID is required',
          null
        )
      );
    }

    // ------------------------------------------
    // Validate amount
    // ------------------------------------------
    const fundingAmount =
      Number(amount);

    if (
      !Number.isFinite(fundingAmount) ||
      fundingAmount <= 0
    ) {

      return res.status(
        HTTP_STATUS.BAD_REQUEST
      ).json(
        formatResponse(
          false,
          'Valid funding amount is required',
          null
        )
      );
    }

    // ------------------------------------------
    // Authentication
    // ------------------------------------------
    if (!userId) {

      return res.status(
        HTTP_STATUS.UNAUTHORIZED
      ).json(
        formatResponse(
          false,
          'User authentication required',
          null
        )
      );
    }

    // ------------------------------------------
    // Find project
    // Supports both ObjectId and "1"
    // ------------------------------------------
    const project =
      await findProjectByFlexibleId(projectId);

    if (!project) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          'Project not found',
          null
        )
      );
    }

    // ------------------------------------------
    // Save funding information
    // ------------------------------------------
    project.fundingAmount =
      fundingAmount;

    project.fundingType =
      fundingType || 'Grant';

    project.fundingDescription =
      description ||
      commitment ||
      '';

    project.fundedBy =
      userId;

    project.fundedAt =
      new Date();

    await project.save();

    // ------------------------------------------
    // Populate updated project
    // ------------------------------------------
    await project.populate([
      {
        path: 'industryMentor',
        select:
          'name email organization expertise'
      },
      {
        path: 'fundedBy',
        select:
          'name email organization'
      },
      {
        path: 'problem'
      },
      {
        path: 'team'
      }
    ]);

    console.log(
      '✅ PROJECT FUNDED SUCCESSFULLY'
    );

    console.log(
      'Funding amount:',
      project.fundingAmount
    );

    console.log(
      'Funding type:',
      project.fundingType
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Funding committed successfully',
        {
          project,

          funding: {
            amount: fundingAmount,

            fundingType:
              project.fundingType,

            description:
              project.fundingDescription,

            timeline:
              timeline || '',

            transactionId:
              transactionId || '',

            remarks:
              remarks || ''
          }
        }
      )
    );

  } catch (error) {

    console.error(
      '❌ FUNDING ERROR:',
      error
    );

    logger.error(
      'Commit funding error:',
      error
    );

    res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
};


// ============================================
// EXPORTS
// ============================================
module.exports = {
  getDashboard,
  getProjects,
  getProjectById,
  getProblemById,
  getMentors,
  addMentor,
  assignMentor,
  commitFunding
};