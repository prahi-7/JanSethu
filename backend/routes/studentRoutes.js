const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Team = require('../models/Team');
const Project = require('../models/Project');
const Problem = require('../models/Problem');

const { HTTP_STATUS } = require('../utils/constants');
const {
  formatResponse,
  paginate,
  getPaginationResponse
} = require('../utils/helpers');

const logger = require('../utils/logger');

// Cloudinary upload helpers
const { upload } = require('../config/multer');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

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
      name: {
        $regex: new RegExp(`^${escapedName}$`, 'i')
      }
    });
  }

  if (!team) {
    const escapedName = teamId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    team = await Team.findOne({
      name: {
        $regex: new RegExp(escapedName, 'i')
      }
    });
  }

  return team;
};

// ============================================
// TEAM ROUTES
// ============================================

// Get all teams
router.get('/teams', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const {
      page: pageNum,
      limit: limitNum,
      skip
    } = paginate(page, limit);

    const query = {};

    if (req.user.role === 'university' && req.user.university) {
      query.university = req.user.university;
    }

    const [teams, total] = await Promise.all([
      Team.find(query)
        .populate('members', 'name email')
        .populate('leader', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Team.countDocuments(query)
    ]);

    const result = getPaginationResponse(
      total,
      pageNum,
      limitNum,
      teams
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Teams fetched successfully',
        result
      )
    );

  } catch (error) {
    logger.error('Get teams error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
});

// Get single team by ID or Name
router.get('/teams/:teamId', auth, async (req, res) => {
  try {
    const { teamId } = req.params;

    console.log('🔍 Looking for team:', teamId);

    const team = await findTeamByIdOrName(teamId);

    if (!team) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(
          false,
          `Team "${teamId}" not found`,
          null,
          ['Team not found']
        )
      );
    }

    await team.populate('members', 'name email');
    await team.populate('leader', 'name email');

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Team fetched successfully',
        { team }
      )
    );

  } catch (error) {
    console.error('❌ Get team error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
});

// Create a new team
router.post('/teams', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      maxMembers,
      university
    } = req.body;

    if (!name) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(
          false,
          'Team name is required',
          null,
          ['Team name is required']
        )
      );
    }

    const existingTeam = await Team.findOne({
      name: {
        $regex: new RegExp(
          `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          'i'
        )
      }
    });

    if (existingTeam) {
      return res.status(HTTP_STATUS.CONFLICT).json(
        formatResponse(
          false,
          'Team name already exists',
          null,
          ['Team name already exists']
        )
      );
    }

    const team = new Team({
      name,
      description: description || '',
      maxMembers: maxMembers || 5,
      university: university || req.user.university || '',
      leader: req.userId,
      members: [req.userId],
      status: 'Forming'
    });

    await team.save();

    await team.populate('members', 'name email');
    await team.populate('leader', 'name email');

    res.status(HTTP_STATUS.CREATED).json(
      formatResponse(
        true,
        'Team created successfully',
        { team }
      )
    );

  } catch (error) {
    logger.error('Create team error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
});

// Join a team by ID or Name
router.post('/teams/:teamId/join', auth, async (req, res) => {
  try {
    const { teamId } = req.params;

    console.log('🔍 Joining team:', teamId);

    const team = await findTeamByIdOrName(teamId);

    if (!team) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(
          false,
          `Team "${teamId}" not found`,
          null,
          ['Team not found']
        )
      );
    }

    if (team.members.includes(req.userId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(
          false,
          'Already a member',
          null,
          ['You are already a member of this team']
        )
      );
    }

    await team.addMember(req.userId);
    await team.populate('members', 'name email');

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Joined team successfully',
        { team }
      )
    );

  } catch (error) {
    console.error('❌ Join team error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
});

// Leave a team by ID or Name
router.post('/teams/:teamId/leave', auth, async (req, res) => {
  try {
    const { teamId } = req.params;

    console.log('🔍 Leaving team:', teamId);

    const team = await findTeamByIdOrName(teamId);

    if (!team) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(
          false,
          `Team "${teamId}" not found`,
          null,
          ['Team not found']
        )
      );
    }

    if (!team.members.includes(req.userId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(
          false,
          'Not a member',
          null,
          ['You are not a member of this team']
        )
      );
    }

    await team.removeMember(req.userId);
    await team.populate('members', 'name email');

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Left team successfully',
        { team }
      )
    );

  } catch (error) {
    console.error('❌ Leave team error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
});

// ============================================
// PROJECT ROUTES
// ============================================

// Get all projects
router.get('/projects', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const {
      page: pageNum,
      limit: limitNum,
      skip
    } = paginate(page, limit);

    const query = {};

    if (req.user.role === 'student') {
      const userTeams = await Team.find({
        members: req.userId
      }).select('_id');

      const teamIds = userTeams.map(t => t._id);

      query.team = {
        $in: teamIds
      };
    }

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('team', 'name members')
        .populate('problem', 'title category status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Project.countDocuments(query)
    ]);

    const result = getPaginationResponse(
      total,
      pageNum,
      limitNum,
      projects
    );

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Projects fetched successfully',
        result
      )
    );

  } catch (error) {
    logger.error('Get projects error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
});

// Get single project
router.get('/projects/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('team', 'name members')
      .populate(
        'problem',
        'title category status description'
      );

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(
          false,
          'Project not found',
          null,
          ['Project not found']
        )
      );
    }

    res.status(HTTP_STATUS.OK).json(
      formatResponse(
        true,
        'Project fetched successfully',
        { project }
      )
    );

  } catch (error) {
    logger.error('Get project error:', error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(
        false,
        'Internal server error',
        null,
        [error.message]
      )
    );
  }
});

// ============================================
// CREATE PROJECT WITH CLOUDINARY UPLOAD
// ============================================

router.post(
  '/projects',
  auth,
  upload.fields([
    {
      name: 'files',
      maxCount: 10
    }
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        problemId,
        teamId,
        solutionType
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          formatResponse(
            false,
            'Project title is required',
            null,
            ['Project title is required']
          )
        );
      }

      if (!description || description.trim().length < 10) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          formatResponse(
            false,
            'Project description must be at least 10 characters',
            null,
            ['Project description must be at least 10 characters']
          )
        );
      }

      if (!teamId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          formatResponse(
            false,
            'Team is required',
            null,
            ['A project must belong to a team']
          )
        );
      }

      // Find team
      const team = await findTeamByIdOrName(teamId);

      if (!team) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatResponse(
            false,
            'Team not found',
            null,
            ['The selected team does not exist']
          )
        );
      }

      // Check membership
      const isMember = team.members.some(
        memberId =>
          memberId.toString() === req.userId.toString()
      );

      if (!isMember) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          formatResponse(
            false,
            'You are not a member of this team',
            null,
            ['Only team members can create a project for this team']
          )
        );
      }

      // Solution type
      const projectSolutionType =
        solutionType === 'Hardware'
          ? 'Hardware'
          : 'Software';

      // Uploaded files
      const uploadedFiles = req.files?.files || [];

      console.log(
        '📁 Project files received:',
        uploadedFiles.length
      );

      const projectFiles = [];

      // Upload each file to Cloudinary
      for (const file of uploadedFiles) {
        let resourceType = 'raw';

        if (file.mimetype.startsWith('image/')) {
          resourceType = 'image';
        } else if (file.mimetype.startsWith('video/')) {
          resourceType = 'video';
        }

        console.log(
          `☁️ Uploading project file: ${file.originalname} (${resourceType})`
        );

        const result = await uploadToCloudinary(
          file.buffer,
          {
            folder: 'jansethu/projects',
            resourceType
          }
        );

        projectFiles.push({
          name: file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          size: file.size
        });
      }

      // Create project
      const project = new Project({
        title: title.trim(),
        description: description.trim(),
        problem: problemId || null,
        team: team._id,
        solutionType: projectSolutionType,
        files: projectFiles,
        status: 'Idea',
        progress: 0,
        university:
          team.university ||
          req.user.university ||
          ''
      });

      await project.save();

      await project.populate('team', 'name');
      await project.populate('problem', 'title');

      console.log(
        `✅ Project created successfully: ${project._id}`
      );

      res.status(HTTP_STATUS.CREATED).json(
        formatResponse(
          true,
          'Project created successfully',
          { project }
        )
      );

    } catch (error) {
      logger.error(
        'Create project error:',
        error
      );

      console.error(
        '❌ Create project error:',
        error
      );

      res.status(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      ).json(
        formatResponse(
          false,
          'Failed to create project',
          null,
          [error.message]
        )
      );
    }
  }
);

// ============================================
// SUBMIT PROJECT
// ============================================

router.patch(
  '/projects/:projectId/submit',
  auth,
  async (req, res) => {
    try {
      const { projectId } = req.params;

      const project =
        await Project.findById(projectId)
          .populate(
            'team',
            'name members leader'
          );

      if (!project) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Project not found',
            null,
            ['Project not found']
          )
        );
      }

      if (!project.team) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Project is not associated with a team',
            null,
            [
              'A project must belong to a team before submission'
            ]
          )
        );
      }

      const isMember =
        project.team.members?.some(
          memberId =>
            memberId.toString() ===
            req.userId.toString()
        );

      if (!isMember) {
        return res.status(
          HTTP_STATUS.FORBIDDEN
        ).json(
          formatResponse(
            false,
            'You are not a member of this team',
            null,
            [
              'Only team members can submit this project'
            ]
          )
        );
      }

      if (project.status === 'Review') {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Project has already been submitted',
            null,
            ['This project is already under review']
          )
        );
      }

      if (project.status === 'Completed') {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Project is already completed',
            null,
            ['A completed project cannot be submitted again']
          )
        );
      }

      project.status = 'Review';
      project.progress = 100;

      await project.save();

      await project.populate(
        'team',
        'name members leader'
      );

      await project.populate(
        'problem',
        'title category status description'
      );

      res.status(HTTP_STATUS.OK).json(
        formatResponse(
          true,
          'Project submitted successfully for review',
          { project }
        )
      );

    } catch (error) {
      logger.error(
        'Submit project error:',
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
  }
);

// ============================================
// PROBLEM ROUTES FOR STUDENTS
// ============================================

// Get problems for students
router.get('/problems', auth, async (req, res) => {
  try {
    const {
      category,
      status,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      status: {
        $in: [
          'Pending',
          'Under Review',
          'In Progress'
        ]
      }
    };

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
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

    const [problems, total] =
      await Promise.all([
        Problem.find(query)
          .populate(
            'citizen',
            'name email'
          )
          .populate(
            'assignedTo',
            'name email role'
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum),

        Problem.countDocuments(query)
      ]);

    const result =
      getPaginationResponse(
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
    logger.error(
      'Get student problems error:',
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
});

module.exports = router;