
const Problem = require('../models/Problem');
const ProblemTimeline = require('../models/ProblemTimeline');
const User = require('../models/User');

const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

const {
  formatResponse,
  paginate,
  getPaginationResponse
} = require('../utils/helpers');

const logger = require('../utils/logger');
const {
  uploadToCloudinary
} = require('../utils/cloudinaryUpload');

// AI service
const {
  analyzeProblem
} = require('../services/aiService');


// ============================================================
// CREATE A NEW PROBLEM
// ============================================================

const createProblem = async (req, res) => {
  try {
    console.log('📥 Create problem request');
    console.log('📥 Body:', req.body);
    console.log('📥 Files:', req.files);

    const {
      title,
      description,
      category,
      priority,
      anonymous,
      location
    } = req.body;


    // ----------------------------------------------------------
    // Parse location
    // ----------------------------------------------------------

    let parsedLocation = location;

    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (e) {
        parsedLocation = {
          lat: parseFloat(
            req.body['location[lat]'] ||
            req.body.lat ||
            0
          ),

          lng: parseFloat(
            req.body['location[lng]'] ||
            req.body.lng ||
            0
          ),

          address:
            req.body['location[address]'] ||
            req.body.address ||
            ''
        };
      }
    }


    // ----------------------------------------------------------
    // Handle uploaded files
    // ----------------------------------------------------------

    const photoFiles = req.files?.photos || [];
    const videoFiles = req.files?.videos || [];


    // ----------------------------------------------------------
    // Upload photos to Cloudinary
    // ----------------------------------------------------------

    const photoUrls = [];

    for (const file of photoFiles) {
      const result = await uploadToCloudinary(
        file.buffer,
        {
          folder: 'jansethu/problems/images',
          resourceType: 'image'
        }
      );

      photoUrls.push(result.secure_url);
    }


    // ----------------------------------------------------------
    // Upload videos to Cloudinary
    // ----------------------------------------------------------

    const videoUrls = [];

    for (const file of videoFiles) {
      const result = await uploadToCloudinary(
        file.buffer,
        {
          folder: 'jansethu/problems/videos',
          resourceType: 'video'
        }
      );

      videoUrls.push(result.secure_url);
    }


    // ----------------------------------------------------------
    // Existing photo/video URLs
    // ----------------------------------------------------------

    let existingPhotos = [];
    let existingVideos = [];


    if (req.body.photos) {
      try {
        existingPhotos =
          typeof req.body.photos === 'string'
            ? JSON.parse(req.body.photos)
            : req.body.photos;
      } catch (e) {
        existingPhotos = [];
      }
    }


    if (req.body.videos) {
      try {
        existingVideos =
          typeof req.body.videos === 'string'
            ? JSON.parse(req.body.videos)
            : req.body.videos;
      } catch (e) {
        existingVideos = [];
      }
    }


    // Make sure they are arrays

    if (!Array.isArray(existingPhotos)) {
      existingPhotos = [];
    }

    if (!Array.isArray(existingVideos)) {
      existingVideos = [];
    }


    // ----------------------------------------------------------
    // Validate required fields
    // ----------------------------------------------------------

    if (
      !title ||
      !description ||
      !category ||
      !parsedLocation ||
      parsedLocation.lat === undefined ||
      parsedLocation.lng === undefined
    ) {
      return res.status(
        HTTP_STATUS.BAD_REQUEST
      ).json(
        formatResponse(
          false,
          'Missing required fields',
          null,
          [
            'Title, description, category, and location are required'
          ]
        )
      );
    }


    // ----------------------------------------------------------
    // Prepare problem data
    // ----------------------------------------------------------

    const problemData = {
      title,
      description,

      category,

      priority:
        priority || 'Medium',

      anonymous:
        anonymous === 'true' ||
        anonymous === true ||
        false,

      location: {
        lat: parseFloat(parsedLocation.lat),

        lng: parseFloat(parsedLocation.lng),

        address:
          parsedLocation.address || ''
      },

      photos: [
        ...existingPhotos,
        ...photoUrls
      ],

      videos: [
        ...existingVideos,
        ...videoUrls
      ],

      citizen: req.userId,

      // --------------------------------------------------------
      // AI starts in pending state
      // --------------------------------------------------------

      aiAnalysis: {
        status: 'Pending'
      }
    };


    // ----------------------------------------------------------
    // Save problem
    // ----------------------------------------------------------

    const problem = new Problem(problemData);

    await problem.save();


    // ----------------------------------------------------------
    // Create initial timeline entry
    // ----------------------------------------------------------

    await ProblemTimeline.create({
      problem: problem._id,

      status: 'Pending',

      changedBy: req.userId,

      comment: 'Problem reported'
    });


    // ==========================================================
    // AUTOMATIC AI ANALYSIS
    // ==========================================================
    //
    // IMPORTANT:
    // We DO NOT await this.
    //
    // The citizen gets the response immediately.
    // AI continues processing in the background.
    //
    // This allows the frontend to show:
    //
    //       🟣 AI ANALYZING...
    //
    // ==========================================================

    analyzeProblem({
      title: problem.title,

      description: problem.description,

      location: problem.location,

      existingCategory: problem.category,

      existingPriority: problem.priority

    })
      .then(async (analysis) => {

        try {

          const updatedProblem =
            await Problem.findById(problem._id);

          if (!updatedProblem) {
            console.log(
              '⚠️ Problem disappeared before AI analysis completed:',
              problem._id
            );

            return;
          }


          // ----------------------------------------------------
          // Store AI analysis
          // ----------------------------------------------------

          updatedProblem.aiAnalysis = analysis;


          // ----------------------------------------------------
          // AI can improve category and priority
          // ----------------------------------------------------

          if (analysis.category) {
            updatedProblem.category =
              analysis.category;
          }


          if (analysis.priority) {
            updatedProblem.priority =
              analysis.priority;
          }


          await updatedProblem.save();


          console.log(
            '🤖 AI analysis completed:',
            problem._id
          );

          console.log(
            '🤖 Category:',
            analysis.category
          );

          console.log(
            '🤖 Priority:',
            analysis.priority
          );

          console.log(
            '🤖 Confidence:',
            analysis.confidence
          );

        } catch (error) {

          logger.error(
            'Failed to save AI analysis:',
            error
          );

        }

      })
      .catch(async (error) => {

        logger.error(
          'Background AI analysis failed:',
          error
        );


        // ------------------------------------------------------
        // Mark AI analysis as failed
        // ------------------------------------------------------

        try {

          await Problem.findByIdAndUpdate(
            problem._id,

            {
              $set: {
                'aiAnalysis.status': 'Failed',
                'aiAnalysis.processedAt':
                  new Date()
              }
            }
          );

        } catch (updateError) {

          logger.error(
            'Failed to update AI failure status:',
            updateError
          );

        }

      });


    // ----------------------------------------------------------
    // Return immediately to citizen
    // ----------------------------------------------------------

    return res.status(
      HTTP_STATUS.CREATED
    ).json(
      formatResponse(
        true,
        MESSAGES.PROBLEM_CREATED,
        {
          problem
        }
      )
    );


  } catch (error) {

    logger.error(
      'Create problem error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// GET ALL PROBLEMS
// ============================================================

const getProblems = async (req, res) => {
  try {

    const {
      category,
      status,
      priority,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};


    if (category) {
      query.category = category;
    }


    if (status) {
      query.status = status;
    }


    if (priority) {
      query.priority = priority;
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


    const [
      problems,
      total
    ] = await Promise.all([

      Problem.find(query)
        .populate(
          'citizen',
          'name email role'
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

      Problem.countDocuments(query)

    ]);


    const result =
      getPaginationResponse(
        total,
        pageNum,
        limitNum,
        problems
      );


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        MESSAGES.PROBLEMS_FETCHED,
        result
      )
    );


  } catch (error) {

    logger.error(
      'Get problems error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// GET SINGLE PROBLEM
// ============================================================

const getProblemById = async (req, res) => {
  try {

    const { id } = req.params;


    const problem =
      await Problem.findById(id)

        .populate(
          'citizen',
          'name email role phone address'
        )

        .populate(
          'assignedTo',
          'name email role'
        )

        .populate({
          path: 'timeline',

          populate: {
            path: 'changedBy',
            select: 'name email role'
          }
        });


    if (!problem) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          MESSAGES.PROBLEM_NOT_FOUND,
          null,
          ['Problem not found']
        )
      );
    }


    // Increment views

    problem.views += 1;

    await problem.save();


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        'Problem fetched successfully',
        {
          problem
        }
      )
    );


  } catch (error) {

    logger.error(
      'Get problem error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// UPDATE PROBLEM
// ============================================================

const updateProblem = async (req, res) => {
  try {

    const { id } = req.params;

    const updates = req.body;


    const allowedUpdates = [
      'title',
      'description',
      'category',
      'priority',
      'location',
      'photos',
      'videos'
    ];


    const filteredUpdates = {};


    Object.keys(updates).forEach(
      key => {

        if (
          allowedUpdates.includes(key)
        ) {
          filteredUpdates[key] =
            updates[key];
        }

      }
    );


    const problem =
      await Problem.findByIdAndUpdate(
        id,
        filteredUpdates,
        {
          new: true,
          runValidators: true
        }
      );


    if (!problem) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          MESSAGES.PROBLEM_NOT_FOUND,
          null,
          ['Problem not found']
        )
      );
    }


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        MESSAGES.PROBLEM_UPDATED,
        {
          problem
        }
      )
    );


  } catch (error) {

    logger.error(
      'Update problem error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// DELETE PROBLEM
// ============================================================

const deleteProblem = async (req, res) => {
  try {

    const { id } = req.params;


    const problem =
      await Problem.findByIdAndDelete(id);


    if (!problem) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          MESSAGES.PROBLEM_NOT_FOUND,
          null,
          ['Problem not found']
        )
      );
    }


    await ProblemTimeline.deleteMany({
      problem: id
    });


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        MESSAGES.PROBLEM_DELETED
      )
    );


  } catch (error) {

    logger.error(
      'Delete problem error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// GET CITIZEN PROBLEMS
// ============================================================

const getCitizenProblems = async (req, res) => {
  try {

    const { citizenId } = req.params;

    const {
      page = 1,
      limit = 10
    } = req.query;


    const isOwnProblems =
      String(req.userId) ===
      String(citizenId);


    const isAdminOrGovernment =
      req.userRole === 'admin' ||
      req.userRole === 'government';


    if (
      !isOwnProblems &&
      !isAdminOrGovernment
    ) {

      return res.status(
        HTTP_STATUS.FORBIDDEN
      ).json(
        formatResponse(
          false,
          MESSAGES.FORBIDDEN,
          null,
          ['Access denied']
        )
      );
    }


    const {
      page: pageNum,
      limit: limitNum,
      skip
    } = paginate(page, limit);


    const [
      problems,
      total
    ] = await Promise.all([

      Problem.find({
        citizen: citizenId
      })
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(limitNum),

      Problem.countDocuments({
        citizen: citizenId
      })

    ]);


    const result =
      getPaginationResponse(
        total,
        pageNum,
        limitNum,
        problems
      );


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        'Citizen problems fetched successfully',
        result
      )
    );


  } catch (error) {

    logger.error(
      'Get citizen problems error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// GET MAP PROBLEMS
// ============================================================

const getMapProblems = async (req, res) => {
  try {

    const {
      category,
      status
    } = req.query;


    const query = {};


    if (category) {
      query.category = category;
    }


    if (status) {
      query.status = status;
    }


    query['location.lat'] = {
      $exists: true
    };


    query['location.lng'] = {
      $exists: true
    };


    const problems =
      await Problem.find(query)
        .select(
          'title category status priority location createdAt photos'
        )
        .limit(1000);


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        'Map data fetched successfully',
        {
          problems
        }
      )
    );


  } catch (error) {

    logger.error(
      'Get map problems error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// GET PROBLEM TIMELINE
// ============================================================

const getProblemTimeline = async (req, res) => {
  try {

    const { id } = req.params;


    const timeline =
      await ProblemTimeline.find({
        problem: id
      })

        .populate(
          'changedBy',
          'name email role'
        )

        .populate(
          'assignmentInfo.assignedTo',
          'name email role'
        )

        .sort({
          timestamp: -1
        });


    if (
      !timeline ||
      timeline.length === 0
    ) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          'No timeline found',
          null,
          [
            'Timeline not found for this problem'
          ]
        )
      );
    }


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        'Timeline fetched successfully',
        {
          timeline
        }
      )
    );


  } catch (error) {

    logger.error(
      'Get timeline error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// UPDATE PROBLEM STATUS
// ============================================================

const updateStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      status,
      comment
    } = req.body;


    if (!status) {

      return res.status(
        HTTP_STATUS.BAD_REQUEST
      ).json(
        formatResponse(
          false,
          'Status is required',
          null,
          [
            'Please provide a status'
          ]
        )
      );
    }


    const problem =
      await Problem.findById(id);


    if (!problem) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          MESSAGES.PROBLEM_NOT_FOUND,
          null,
          ['Problem not found']
        )
      );
    }


    problem.status = status;

    await problem.save();


    await ProblemTimeline.create({

      problem: problem._id,

      status: status,

      changedBy: req.userId,

      comment: comment || ''

    });


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        'Status updated successfully',
        {
          problem
        }
      )
    );


  } catch (error) {

    logger.error(
      'Update status error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// ASSIGN PROBLEM
// ============================================================

const assignProblem = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      assignedTo,
      department,
      comment
    } = req.body;


    if (
      !assignedTo &&
      !department
    ) {

      return res.status(
        HTTP_STATUS.BAD_REQUEST
      ).json(
        formatResponse(
          false,
          'AssignedTo or department required',
          null,
          [
            'Please provide assignment details'
          ]
        )
      );
    }


    const problem =
      await Problem.findById(id);


    if (!problem) {

      return res.status(
        HTTP_STATUS.NOT_FOUND
      ).json(
        formatResponse(
          false,
          MESSAGES.PROBLEM_NOT_FOUND,
          null,
          ['Problem not found']
        )
      );
    }


    if (assignedTo) {
      problem.assignedTo =
        assignedTo;
    }


    if (department) {
      problem.assignedDepartment =
        department;
    }


    await problem.save();


    await ProblemTimeline.create({

      problem: problem._id,

      status: problem.status,

      changedBy: req.userId,

      comment:
        comment ||
        'Problem assigned',

      assignmentInfo: {

        assignedTo:
          assignedTo,

        department:
          department

      }

    });


    return res.status(
      HTTP_STATUS.OK
    ).json(
      formatResponse(
        true,
        'Problem assigned successfully',
        {
          problem
        }
      )
    );


  } catch (error) {

    logger.error(
      'Assign problem error:',
      error
    );


    return res.status(
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).json(
      formatResponse(
        false,
        MESSAGES.INTERNAL_ERROR,
        null,
        [error.message]
      )
    );
  }
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  createProblem,

  getProblems,

  getProblemById,

  updateProblem,

  deleteProblem,

  getCitizenProblems,

  getMapProblems,

  getProblemTimeline,

  updateStatus,

  assignProblem
};
