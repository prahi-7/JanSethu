const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const auth = require('../middleware/auth');

const Team = require('../models/Team');
const Project = require('../models/Project');
const Problem = require('../models/Problem');
const User = require('../models/User');
const TeamInvitation = require('../models/TeamInvitation');
const {
  sendTeamInvitationEmail,
  sendTeamInvitationResponseEmail
} = require('../services/emailService');


const { HTTP_STATUS } = require('../utils/constants');
const {
  formatResponse,
  paginate,
  getPaginationResponse
} = require('../utils/helpers');

const logger = require('../utils/logger');

// Cloudinary upload helpers
const { upload } = require('../config/multer');
const {
  uploadToCloudinary
} = require('../utils/cloudinaryUpload');

// Student ↔ Problem AI matching
const {
  calculateStudentProblemMatch
} = require('../services/studentMatchService');

// ============================================================
// HELPER FUNCTION
// ============================================================

const findTeamByIdOrName = async (teamId) => {
  let team = null;

  const isValidObjectId =
    /^[0-9a-fA-F]{24}$/.test(teamId);

  if (isValidObjectId) {
    team = await Team.findById(teamId);
  }

  if (!team) {
    const escapedName =
      teamId.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

    team = await Team.findOne({
      name: {
        $regex: new RegExp(
          `^${escapedName}$`,
          'i'
        )
      }
    });
  }

  if (!team) {
    const escapedName =
      teamId.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

    team = await Team.findOne({
      name: {
        $regex: new RegExp(
          escapedName,
          'i'
        )
      }
    });
  }

  return team;
};

// ============================================================
// TEAM ROUTES
// ============================================================

// Get all teams
router.get('/teams', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const {
      page: pageNum,
      limit: limitNum,
      skip
    } = paginate(page, limit);

    const query = {};

    if (
      req.user.role === 'university' &&
      req.user.university
    ) {
      query.university =
        req.user.university;
    }

    const [
      teams,
      total
    ] = await Promise.all([
      Team.find(query)
        .populate(
          'members',
          'name email'
        )
        .populate(
          'leader',
          'name email'
        )
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(limitNum),

      Team.countDocuments(query)
    ]);

    const result =
      getPaginationResponse(
        total,
        pageNum,
        limitNum,
        teams
      );

    res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        'Teams fetched successfully',
        result
      )
    );

  } catch (error) {
    logger.error(
      'Get teams error:',
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

// Get single team by ID or Name
router.get(
  '/teams/:teamId',
  auth,
  async (req, res) => {
    try {
      const {
        teamId
      } = req.params;

      console.log(
        '🔍 Looking for team:',
        teamId
      );

      const team =
        await findTeamByIdOrName(
          teamId
        );

      if (!team) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            `Team "${teamId}" not found`,
            null,
            ['Team not found']
          )
        );
      }

      await team.populate(
        'members',
        'name email'
      );

      await team.populate(
        'leader',
        'name email'
      );

      res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Team fetched successfully',
          { team }
        )
      );

    } catch (error) {
      console.error(
        '❌ Get team error:',
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

// Create a new team
router.post(
  '/teams',
  auth,
  async (req, res) => {
    try {
      const {
        name,
        description,
        maxMembers,
        university
      } = req.body;

      if (!name) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Team name is required',
            null,
            ['Team name is required']
          )
        );
      }

      const existingTeam =
        await Team.findOne({
          name: {
            $regex:
              new RegExp(
                `^${name.replace(
                  /[.*+?^${}()|[\]\\]/g,
                  '\\$&'
                )}$`,
                'i'
              )
          }
        });

      if (existingTeam) {
        return res.status(
          HTTP_STATUS.CONFLICT
        ).json(
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
        description:
          description || '',
        maxMembers:
          maxMembers || 5,
        university:
          university ||
          req.user.university ||
          '',
        leader:
          req.userId,
        members: [
          req.userId
        ],
        status: 'Forming'
      });

      await team.save();

      await team.populate(
        'members',
        'name email'
      );

      await team.populate(
        'leader',
        'name email'
      );

      res.status(
        HTTP_STATUS.CREATED
      ).json(
        formatResponse(
          true,
          'Team created successfully',
          { team }
        )
      );

    } catch (error) {
      logger.error(
        'Create team error:',
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

// Join a team by ID or Name
router.post(
  '/teams/:teamId/join',
  auth,
  async (req, res) => {
    try {
      const {
        teamId
      } = req.params;

      console.log(
        '🔍 Joining team:',
        teamId
      );

      const team =
        await findTeamByIdOrName(
          teamId
        );

      if (!team) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            `Team "${teamId}" not found`,
            null,
            ['Team not found']
          )
        );
      }

      if (
        team.members.includes(
          req.userId
        )
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Already a member',
            null,
            [
              'You are already a member of this team'
            ]
          )
        );
      }

      await team.addMember(
        req.userId
      );

      await team.populate(
        'members',
        'name email'
      );

      res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Joined team successfully',
          { team }
        )
      );

    } catch (error) {
      console.error(
        '❌ Join team error:',
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

// Leave a team by ID or Name
router.post(
  '/teams/:teamId/leave',
  auth,
  async (req, res) => {
    try {
      const {
        teamId
      } = req.params;

      console.log(
        '🔍 Leaving team:',
        teamId
      );

      const team =
        await findTeamByIdOrName(
          teamId
        );

      if (!team) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            `Team "${teamId}" not found`,
            null,
            ['Team not found']
          )
        );
      }

      if (
        !team.members.includes(
          req.userId
        )
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Not a member',
            null,
            [
              'You are not a member of this team'
            ]
          )
        );
      }

      await team.removeMember(
        req.userId
      );

      await team.populate(
        'members',
        'name email'
      );

      res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Left team successfully',
          { team }
        )
      );

    } catch (error) {
      console.error(
        '❌ Leave team error:',
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

// ============================================================
// PROJECT ROUTES
// ============================================================

// Get all projects
router.get(
  '/projects',
  auth,
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10
      } = req.query;

      const {
        page: pageNum,
        limit: limitNum,
        skip
      } = paginate(
        page,
        limit
      );

      const query = {};

      if (
        req.user.role === 'student'
      ) {
        const userTeams =
          await Team.find({
            members: req.userId
          }).select('_id');

        const teamIds =
          userTeams.map(
            t => t._id
          );

        query.team = {
          $in: teamIds
        };
      }

      const [
        projects,
        total
      ] = await Promise.all([
        Project.find(query)
          .populate(
            'team',
            'name members'
          )
          .populate(
            'problem',
            'title category status'
          )
          .sort({
            createdAt: -1
          })
          .skip(skip)
          .limit(limitNum),

        Project.countDocuments(
          query
        )
      ]);

      const result =
        getPaginationResponse(
          total,
          pageNum,
          limitNum,
          projects
        );

      res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Projects fetched successfully',
          result
        )
      );

    } catch (error) {
      logger.error(
        'Get projects error:',
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

// Get single project
router.get(
  '/projects/:projectId',
  auth,
  async (req, res) => {
    try {
      const {
        projectId
      } = req.params;

      const project =
        await Project.findById(
          projectId
        )
          .populate(
            'team',
            'name members'
          )
          .populate(
            'problem',
            'title category status description'
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

      res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Project fetched successfully',
          { project }
        )
      );

    } catch (error) {
      logger.error(
        'Get project error:',
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

// ============================================================
// CREATE PROJECT WITH CLOUDINARY UPLOAD
// ============================================================

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

      if (
        !title ||
        !title.trim()
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Project title is required',
            null,
            [
              'Project title is required'
            ]
          )
        );
      }

      if (
        !description ||
        description.trim().length < 10
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Project description must be at least 10 characters',
            null,
            [
              'Project description must be at least 10 characters'
            ]
          )
        );
      }

      if (!teamId) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Team is required',
            null,
            [
              'A project must belong to a team'
            ]
          )
        );
      }

      const team =
        await findTeamByIdOrName(
          teamId
        );

      if (!team) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Team not found',
            null,
            [
              'The selected team does not exist'
            ]
          )
        );
      }

      const isMember =
        team.members.some(
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
              'Only team members can create a project for this team'
            ]
          )
        );
      }

      const projectSolutionType =
        solutionType === 'Hardware'
          ? 'Hardware'
          : 'Software';

      const uploadedFiles =
        req.files?.files || [];

      console.log(
        '📁 Project files received:',
        uploadedFiles.length
      );

      const projectFiles = [];

      for (
        const file of uploadedFiles
      ) {
        let resourceType = 'raw';

        if (
          file.mimetype.startsWith(
            'image/'
          )
        ) {
          resourceType = 'image';

        } else if (
          file.mimetype.startsWith(
            'video/'
          )
        ) {
          resourceType = 'video';
        }

        console.log(
          `☁️ Uploading project file: ${file.originalname} (${resourceType})`
        );

        const result =
          await uploadToCloudinary(
            file.buffer,
            {
              folder:
                'jansethu/projects',
              resourceType
            }
          );

        projectFiles.push({
          name:
            file.originalname,
          url:
            result.secure_url,
          publicId:
            result.public_id,
          resourceType:
            result.resource_type,
          format:
            result.format,
          size:
            file.size
        });
      }

      const project =
        new Project({
          title:
            title.trim(),

          description:
            description.trim(),

          problem:
            problemId || null,

          team:
            team._id,

          solutionType:
            projectSolutionType,

          files:
            projectFiles,

          status:
            'Idea',

          progress:
            0,

          university:
            team.university ||
            req.user.university ||
            ''
        });

      await project.save();

      await project.populate(
        'team',
        'name'
      );

      await project.populate(
        'problem',
        'title'
      );

      console.log(
        `✅ Project created successfully: ${project._id}`
      );

      res.status(
        HTTP_STATUS.CREATED
      ).json(
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

// ============================================================
// SUBMIT PROJECT
// ============================================================

router.patch(
  '/projects/:projectId/submit',
  auth,
  async (req, res) => {
    try {
      const {
        projectId
      } = req.params;

      const project =
        await Project.findById(
          projectId
        )
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

      if (
        project.status ===
        'Review'
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Project has already been submitted',
            null,
            [
              'This project is already under review'
            ]
          )
        );
      }

      if (
        project.status ===
        'Completed'
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Project is already completed',
            null,
            [
              'A completed project cannot be submitted again'
            ]
          )
        );
      }

      project.status =
        'Review';

      project.progress =
        100;

      await project.save();

      await project.populate(
        'team',
        'name members leader'
      );

      await project.populate(
        'problem',
        'title category status description'
      );

      res.status(
        HTTP_STATUS.OK
      ).json(
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

// ============================================================
// PROBLEM ROUTES FOR STUDENTS
// ============================================================

// Get problems for students
router.get(
  '/problems',
  auth,
  async (req, res) => {
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
        query.category =
          category;
      }

      if (status) {
        query.status =
          status;
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
      } = paginate(
        page,
        limit
      );

      const [
        problems,
        total
      ] = await Promise.all([
        Problem.find(query)
          .populate(
            'citizen',
            'name email'
          )
          .populate(
            'assignedTo',
            'name email role'
          )
          .sort({
            createdAt: -1
          })
          .skip(skip)
          .limit(limitNum),

        Problem.countDocuments(
          query
        )
      ]);

      const result =
        getPaginationResponse(
          total,
          pageNum,
          limitNum,
          problems
        );

      res.status(
        HTTP_STATUS.OK
      ).json(
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
  }
);

// ============================================================
// STEP 1
// STUDENT ↔ PROBLEM AI MATCH
// ============================================================

router.get(
  '/problems/:problemId/match',
  auth,
  async (req, res) => {
    try {
      const {
        problemId
      } = req.params;

      console.log(
        '🤖 Calculating student ↔ problem match:',
        problemId
      );

      if (
        !mongoose.Types.ObjectId.isValid(
          problemId
        )
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Invalid problem ID',
            null,
            [
              'The supplied problem ID is not valid'
            ]
          )
        );
      }

      const student =
        await User.findById(
          req.userId
        ).select(
          'name email role university department year skills expertise designation'
        );

      if (!student) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Student profile not found',
            null,
            [
              'Unable to find the logged-in student profile'
            ]
          )
        );
      }

      if (
        student.role !==
        'student'
      ) {
        return res.status(
          HTTP_STATUS.FORBIDDEN
        ).json(
          formatResponse(
            false,
            'Only students can request problem matching',
            null,
            [
              'This endpoint is available only for student accounts'
            ]
          )
        );
      }

      const problem =
        await Problem.findById(
          problemId
        ).select(
          'title description category priority status location aiAnalysis createdAt'
        );

      if (!problem) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Problem not found',
            null,
            [
              'The selected problem does not exist'
            ]
          )
        );
      }

      const match =
        calculateStudentProblemMatch(
          student,
          problem
        );

      console.log(
        '🤖 Student match result:',
        {
          student:
            student.name,
          problem:
            problem.title,
          score:
            match.score,
          level:
            match.level
        }
      );

      return res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Student problem match calculated successfully',
          {
            problemId:
              problem._id,

            studentId:
              student._id,

            student: {
              name:
                student.name,
              university:
                student.university,
              department:
                student.department
            },

            match
          }
        )
      );

    } catch (error) {
      logger.error(
        'Student problem match error:',
        error
      );

      console.error(
        '❌ Student problem match error:',
        error
      );

      return res.status(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      ).json(
        formatResponse(
          false,
          'Failed to calculate student problem match',
          null,
          [error.message]
        )
      );
    }
  }
);

// ============================================================
// STEP 2
// RECOMMENDED STUDENTS FOR SELECTED PROBLEM
// ============================================================
//
// Student 1 selects a problem and chooses to form a team.
//
// This endpoint:
// - gets all active students
// - excludes the logged-in student
// - calculates every student's contribution match
// - sorts students by highest match
//
// This endpoint DOES NOT:
// - create a team
// - add students to a team
// - send invitations
// - automatically assign anybody
//
// Student 1 remains completely in control.
// ============================================================

router.get(
  '/problems/:problemId/recommended-students',
  auth,
  async (req, res) => {
    try {
      const {
        problemId
      } = req.params;

      console.log(
        '🤖 Finding recommended students for problem:',
        problemId
      );

      // --------------------------------------------------------
      // Validate problem ID
      // --------------------------------------------------------

      if (
        !mongoose.Types.ObjectId.isValid(
          problemId
        )
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Invalid problem ID',
            null,
            [
              'The supplied problem ID is not valid'
            ]
          )
        );
      }

      // --------------------------------------------------------
      // Ensure logged-in user is a student
      // --------------------------------------------------------

      const currentStudent =
        await User.findById(
          req.userId
        ).select(
          'name email role university department year skills expertise designation'
        );

      if (!currentStudent) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Student profile not found',
            null,
            [
              'Unable to find the logged-in student profile'
            ]
          )
        );
      }

      if (
        currentStudent.role !==
        'student'
      ) {
        return res.status(
          HTTP_STATUS.FORBIDDEN
        ).json(
          formatResponse(
            false,
            'Only students can view recommended students',
            null,
            [
              'This endpoint is available only for student accounts'
            ]
          )
        );
      }

      // --------------------------------------------------------
      // Get selected problem
      // --------------------------------------------------------

      const problem =
        await Problem.findById(
          problemId
        ).select(
          'title description category priority status location aiAnalysis createdAt'
        );

      if (!problem) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Problem not found',
            null,
            [
              'The selected problem does not exist'
            ]
          )
        );
      }

      // --------------------------------------------------------
      // Get all active students
      // --------------------------------------------------------

      const students =
        await User.find({
          role: 'student',
          isActive: {
            $ne: false
          },
          _id: {
            $ne: req.userId
          }
        }).select(
          'name email university department year skills expertise designation profileComplete'
        );

      console.log(
        `👥 Students available for matching: ${students.length}`
      );

      // --------------------------------------------------------
      // Calculate match for every student
      // --------------------------------------------------------

      const recommendations =
        students
          .map(student => {
  const match =
    calculateStudentProblemMatch(
      student,
      problem
    );

  console.log(
    '🎯 Student recommendation check:',
    {
      student: student.name,
      department: student.department,
      skills: student.skills,
      expertise: student.expertise,
      problemCategory: problem.category,
      aiCategory: problem.aiAnalysis?.category,
      aiDisciplines: problem.aiAnalysis?.disciplines,
      aiTechnologies: problem.aiAnalysis?.technologies,
      aiKeywords: problem.aiAnalysis?.keywords,
      score: match?.score,
      percentage: match?.percentage,
      level: match?.level,
      categoryMatch: match?.categoryMatch,
      matchedDepartment: match?.matchedDepartment,
      matchedDomains: match?.matchedDomains,
      matchedSkills: match?.matchedSkills,
      matchedExpertise: match?.matchedExpertise,
      reason: match?.reason
    }
  );

  return {
              studentId:
                student._id,

              name:
                student.name,

              email:
                student.email,

              university:
                student.university || '',

              department:
                student.department || '',

              year:
                student.year || '',

              profileComplete:
                student.profileComplete || false,

              match
            };
          })
          .filter(
            recommendation =>
              recommendation.match &&
              recommendation.match.percentage > 0
          )
          .sort(
            (a, b) =>
              b.match.percentage -
              a.match.percentage
          );

      // --------------------------------------------------------
      // Return top recommendations
      // --------------------------------------------------------

      const topRecommendations =
        recommendations.slice(
          0,
          20
        );

      console.log(
        `🤝 Recommended students returned: ${topRecommendations.length}`
      );

      return res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Recommended students fetched successfully',
          {
            problemId:
              problem._id,

            problem: {
              title:
                problem.title,

              category:
                problem.category,

              status:
                problem.status
            },

            count:
              topRecommendations.length,

            students:
              topRecommendations
          }
        )
      );

    } catch (error) {
      logger.error(
        'Recommended students error:',
        error
      );

      console.error(
        '❌ Recommended students error:',
        error
      );

      return res.status(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      ).json(
        formatResponse(
          false,
          'Failed to find recommended students',
          null,
          [error.message]
        )
      );
    }
  }
);

// ============================================================
// TEAM INVITATION
// ============================================================

router.post(
  '/team-invitations',
  auth,
  async (req, res) => {
    try {
      const {
        problemId,
        teamId,
        receiverId,
        matchScore,
        matchedSkills,
        reason
      } = req.body;

      // Validate IDs
      if (
        !mongoose.Types.ObjectId.isValid(problemId) ||
        !mongoose.Types.ObjectId.isValid(teamId) ||
        !mongoose.Types.ObjectId.isValid(receiverId)
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Invalid problem, team, or student ID',
            null,
            ['Please provide valid IDs']
          )
        );
      }

      // --------------------------------------------------------
      // Sender
      // --------------------------------------------------------

      const sender =
        await User.findById(
          req.userId
        );

      if (
        !sender ||
        sender.role !== 'student'
      ) {
        return res.status(
          HTTP_STATUS.FORBIDDEN
        ).json(
          formatResponse(
            false,
            'Only students can send team invitations',
            null,
            ['Student account required']
          )
        );
      }

      // --------------------------------------------------------
      // Problem
      // --------------------------------------------------------

      const problem =
        await Problem.findById(
          problemId
        );

      if (!problem) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Problem not found',
            null,
            ['The selected problem does not exist']
          )
        );
      }

      // --------------------------------------------------------
      // Team
      // --------------------------------------------------------

      const team =
        await Team.findById(
          teamId
        );

      if (!team) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Team not found',
            null,
            ['The selected team does not exist']
          )
        );
      }

      // --------------------------------------------------------
      // Check sender belongs to team
      // --------------------------------------------------------

      const senderIsMember =
        team.members.some(
          memberId =>
            memberId.toString() ===
            req.userId.toString()
        );

      if (!senderIsMember) {
        return res.status(
          HTTP_STATUS.FORBIDDEN
        ).json(
          formatResponse(
            false,
            'You are not a member of this team',
            null,
            ['Only team members can send invitations']
          )
        );
      }

      // --------------------------------------------------------
      // Check team capacity
      // --------------------------------------------------------

      if (
        team.members.length >=
        team.maxMembers
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Team is already full',
            null,
            ['No more students can be added']
          )
        );
      }

      // --------------------------------------------------------
      // Receiver
      // --------------------------------------------------------

      const receiver =
        await User.findOne({
          _id: receiverId,
          role: 'student',
          isActive: {
            $ne: false
          }
        });

      if (!receiver) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Student not found',
            null,
            ['The selected student does not exist']
          )
        );
      }

      // --------------------------------------------------------
      // Cannot invite yourself
      // --------------------------------------------------------

      if (
        receiver._id.toString() ===
        req.userId.toString()
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'You cannot invite yourself',
            null,
            ['Select another student']
          )
        );
      }

      // --------------------------------------------------------
      // Check existing team member
      // --------------------------------------------------------

      const alreadyMember =
        team.members.some(
          memberId =>
            memberId.toString() ===
            receiverId.toString()
        );

      if (alreadyMember) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Student is already a team member',
            null,
            ['This student is already in the team']
          )
        );
      }

      // --------------------------------------------------------
      // Check duplicate pending invitation
      // --------------------------------------------------------

      const existingInvitation =
        await TeamInvitation.findOne({
          team: teamId,
          receiver: receiverId,
          status: 'Pending'
        });

      if (existingInvitation) {
        return res.status(
          HTTP_STATUS.CONFLICT
        ).json(
          formatResponse(
            false,
            'Invitation already sent',
            null,
            ['A pending invitation already exists']
          )
        );
      }

      // --------------------------------------------------------
// Create invitation
// --------------------------------------------------------

const invitation =
  await TeamInvitation.create({
    problem: problemId,
    team: teamId,
    sender: req.userId,
    receiver: receiverId,
    matchScore:
      Number(matchScore) || 0,
    matchedSkills:
      Array.isArray(matchedSkills)
        ? matchedSkills
        : [],
    reason:
      reason || '',
    status: 'Pending'
  });

// --------------------------------------------------------
// Email notification to invited student
// --------------------------------------------------------

let emailSent = false;

try {
  if (receiver.email) {
    await sendTeamInvitationEmail({
      receiverEmail: receiver.email,
      receiverName: receiver.name,
      senderName: sender.name,
      teamName: team.name,
      problemTitle: problem.title,
      matchScore: invitation.matchScore,
      matchedSkills: invitation.matchedSkills,
      reason: invitation.reason
    });

    emailSent = true;

    logger.info(
      `Team invitation email sent successfully to ${receiver.email}`
    );
  } else {
    logger.warn(
      `No email address found for invited student ${receiver._id}`
    );
  }

} catch (emailError) {
  // Email failure should NOT cancel the invitation.
  logger.error(
    'Failed to send team invitation email:',
    emailError
  );

  console.error(
    '❌ Team invitation email failed:',
    emailError.message
  );
}

      // --------------------------------------------------------
      // Socket.IO notification
      // --------------------------------------------------------

      const io =
        req.app.get('io');

      if (io) {
        io.to(
          `user_${receiverId}`
        ).emit(
          'team_invitation_received',
          {
            invitationId:
              invitation._id,

            problemId:
              problem._id,

            teamId:
              team._id,

            sender: {
              id: sender._id,
              name: sender.name
            },

            teamName:
              team.name,

            problemTitle:
              problem.title,

            matchScore:
              invitation.matchScore,

            matchedSkills:
              invitation.matchedSkills,

            reason:
              invitation.reason
          }
        );
      }

      // --------------------------------------------------------
      // Success
      // --------------------------------------------------------

      return res.status(
        HTTP_STATUS.CREATED
      ).json(
        formatResponse(
          true,
          'Team invitation sent successfully',
          {
            invitation,
  emailSent
          }
        )
      );

    } catch (error) {
      logger.error(
        'Send team invitation error:',
        error
      );

      console.error(
        '❌ Send team invitation error:',
        error
      );

      return res.status(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      ).json(
        formatResponse(
          false,
          'Failed to send team invitation',
          null,
          [error.message]
        )
      );
    }
  }
);
// ============================================================
// GET PENDING TEAM INVITATIONS
// ============================================================
//
// This allows a logged-in student to see invitations
// that were sent to them and are still pending.
//
// It does NOT accept, decline, or automatically join
// the student to any team.
// ============================================================

router.get(
  '/team-invitations',
  auth,
  async (req, res) => {
    try {
      console.log(
        '📩 Fetching pending team invitations for student:',
        req.userId
      );

      const invitations =
        await TeamInvitation.find({
          receiver: req.userId,
          status: 'Pending'
        })
          .populate(
            'sender',
            'name email university department'
          )
          .populate(
            'team',
            'name members maxMembers'
          )
          .populate(
            'problem',
            'title description category'
          )
          .sort({
            createdAt: -1
          });

      console.log(
        `📩 Pending invitations found: ${invitations.length}`
      );

      return res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Team invitations fetched successfully',
          {
            invitations
          }
        )
      );

    } catch (error) {
      logger.error(
        'Get team invitations error:',
        error
      );

      console.error(
        '❌ Get team invitations error:',
        error
      );

      return res.status(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      ).json(
        formatResponse(
          false,
          'Failed to fetch team invitations',
          null,
          [error.message]
        )
      );
    }
  }
);
// ============================================================
// ACCEPT TEAM INVITATION
// ============================================================

router.patch(
  '/team-invitations/:invitationId/accept',
  auth,
  async (req, res) => {
    try {
      const { invitationId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          invitationId
        )
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Invalid invitation ID',
            null,
            ['The supplied invitation ID is not valid']
          )
        );
      }

      const invitation =
        await TeamInvitation.findById(
          invitationId
        );

      if (!invitation) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Invitation not found',
            null,
            ['The invitation does not exist']
          )
        );
      }

      // Only the receiver can accept
      if (
        invitation.receiver.toString() !==
        req.userId.toString()
      ) {
        return res.status(
          HTTP_STATUS.FORBIDDEN
        ).json(
          formatResponse(
            false,
            'You cannot accept this invitation',
            null,
            ['Only the invited student can accept it']
          )
        );
      }

      // Invitation must still be pending
      if (
        invitation.status !==
        'Pending'
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Invitation is no longer pending',
            null,
            [`Current status: ${invitation.status}`]
          )
        );
      }

      const team =
        await Team.findById(
          invitation.team
        );

      if (!team) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Team not found',
            null,
            ['The team associated with this invitation no longer exists']
          )
        );
      }

      // Check team capacity again
      if (
        team.members.length >=
        team.maxMembers
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Team is already full',
            null,
            ['You cannot join because the team has reached its maximum size']
          )
        );
      }

      // Add student to team
      const alreadyMember =
        team.members.some(
          memberId =>
            memberId.toString() ===
            req.userId.toString()
        );

      if (!alreadyMember) {
        await team.addMember(
          req.userId
        );
      }

      // Update invitation
      invitation.status = 
  'Accepted'; 

invitation.respondedAt = 
  new Date(); 

await invitation.save();


// --------------------------------------------------------
// Send acceptance email to the student who sent invitation
// --------------------------------------------------------

try {
  const [sender, receiver, problem] = await Promise.all([
    User.findById(invitation.sender),
    User.findById(invitation.receiver),
    Problem.findById(invitation.problem)
  ]);

  if (sender?.email) {
    await sendTeamInvitationResponseEmail({
      senderEmail: sender.email,
      senderName: sender.name,
      receiverName: receiver?.name,
      teamName: team.name,
      problemTitle: problem?.title,
      response: 'Accepted'
    });

    logger.info(
      `Team invitation acceptance email sent to ${sender.email}`
    );
  } else {
    logger.warn(
      `No email address found for invitation sender ${invitation.sender}`
    );
  }

} catch (emailError) {

  // Email failure should NOT undo successful acceptance
  logger.error(
    'Failed to send team invitation acceptance email:',
    emailError
  );

  console.error(
    '❌ Team invitation acceptance email failed:',
    emailError.message
  );
}


// Notify sender
const io = 
  req.app.get('io');

      if (io) {
        io.to(
          `user_${invitation.sender}`
        ).emit(
          'team_invitation_response',
          {
            invitationId:
              invitation._id,

            response:
              'Accepted',

            receiverId:
              req.userId,

            teamId:
              team._id,

            teamName:
              team.name
          }
        );
      }

      return res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Team invitation accepted successfully',
          {
            invitation,
            team
          }
        )
      );

    } catch (error) {
      logger.error(
        'Accept team invitation error:',
        error
      );

      console.error(
        '❌ Accept team invitation error:',
        error
      );

      return res.status(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      ).json(
        formatResponse(
          false,
          'Failed to accept team invitation',
          null,
          [error.message]
        )
      );
    }
  }
);

// ============================================================
// DECLINE TEAM INVITATION
// ============================================================

router.patch(
  '/team-invitations/:invitationId/decline',
  auth,
  async (req, res) => {
    try {
      const { invitationId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          invitationId
        )
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Invalid invitation ID',
            null,
            ['The supplied invitation ID is not valid']
          )
        );
      }

      const invitation =
        await TeamInvitation.findById(
          invitationId
        );

      if (!invitation) {
        return res.status(
          HTTP_STATUS.NOT_FOUND
        ).json(
          formatResponse(
            false,
            'Invitation not found',
            null,
            ['The invitation does not exist']
          )
        );
      }

      // Only the receiver can decline
      if (
        invitation.receiver.toString() !==
        req.userId.toString()
      ) {
        return res.status(
          HTTP_STATUS.FORBIDDEN
        ).json(
          formatResponse(
            false,
            'You cannot decline this invitation',
            null,
            ['Only the invited student can decline it']
          )
        );
      }

      // Invitation must still be pending
      if (
        invitation.status !==
        'Pending'
      ) {
        return res.status(
          HTTP_STATUS.BAD_REQUEST
        ).json(
          formatResponse(
            false,
            'Invitation is no longer pending',
            null,
            [`Current status: ${invitation.status}`]
          )
        );
      }

      invitation.status = 
  'Declined'; 

invitation.respondedAt = 
  new Date(); 

await invitation.save();


// --------------------------------------------------------
// Send decline email to the student who sent invitation
// --------------------------------------------------------

try {
  const [sender, receiver, problem, team] = await Promise.all([
    User.findById(invitation.sender),
    User.findById(invitation.receiver),
    Problem.findById(invitation.problem),
    Team.findById(invitation.team)
  ]);

  if (sender?.email) {
    await sendTeamInvitationResponseEmail({
      senderEmail: sender.email,
      senderName: sender.name,
      receiverName: receiver?.name,
      teamName: team?.name,
      problemTitle: problem?.title,
      response: 'Declined'
    });

    logger.info(
      `Team invitation decline email sent to ${sender.email}`
    );
  } else {
    logger.warn(
      `No email address found for invitation sender ${invitation.sender}`
    );
  }

} catch (emailError) {

  // Email failure should NOT undo successful decline
  logger.error(
    'Failed to send team invitation decline email:',
    emailError
  );

  console.error(
    '❌ Team invitation decline email failed:',
    emailError.message
  );
}


// Notify sender
const io = 
  req.app.get('io');

      if (io) {
        io.to(
          `user_${invitation.sender}`
        ).emit(
          'team_invitation_response',
          {
            invitationId:
              invitation._id,

            response:
              'Declined',

            receiverId:
              req.userId,

            teamId:
              invitation.team
          }
        );
      }

      return res.status(
        HTTP_STATUS.OK
      ).json(
        formatResponse(
          true,
          'Team invitation declined successfully',
          {
            invitation
          }
        )
      );

    } catch (error) {
      logger.error(
        'Decline team invitation error:',
        error
      );

      console.error(
        '❌ Decline team invitation error:',
        error
      );

      return res.status(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      ).json(
        formatResponse(
          false,
          'Failed to decline team invitation',
          null,
          [error.message]
        )
      );
    }
  }
);

// ============================================================

module.exports = router;