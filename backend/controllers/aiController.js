const mongoose = require('mongoose');

const Problem = require('../models/Problem');

const {
  analyzeProblem
} = require('../services/aiService');

const {
  syncInstitutionsFromUsers
} = require('../services/institutionMatchingService');

// ================================================================
// ANALYZE ONE PROBLEM
// ================================================================

const analyzeProblemById = async (
  req,
  res,
  next
) => {
  try {
    const {
      problemId
    } = req.params;

    // ------------------------------------------------------------
    // Validate MongoDB ObjectId
    // ------------------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        problemId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid problem ID.'
      });
    }

    // ------------------------------------------------------------
    // Find problem
    // ------------------------------------------------------------

    const problem =
      await Problem.findById(
        problemId
      );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found.'
      });
    }

    // ------------------------------------------------------------
    // Mark AI analysis as Pending
    // ------------------------------------------------------------

    problem.aiAnalysis = {
      ...(problem.aiAnalysis?.toObject?.() ||
        problem.aiAnalysis ||
        {}),

      status: 'Pending'
    };

    await problem.save();

    // ------------------------------------------------------------
    // Get readable location
    // ------------------------------------------------------------

    const location =
      problem.location?.address ||
      JSON.stringify(
        problem.location || ''
      );

    // ------------------------------------------------------------
    // Run AI analysis
    // ------------------------------------------------------------

    const analysis =
      await analyzeProblem({
        title: problem.title,

        description:
          problem.description,

        location,

        existingCategory:
          problem.category,

        existingPriority:
          problem.priority
      });

    // ------------------------------------------------------------
    // Save complete AI analysis
    // ------------------------------------------------------------

    problem.aiAnalysis = {
      ...(problem.aiAnalysis?.toObject?.() ||
        problem.aiAnalysis ||
        {}),

      category:
        analysis.category,

      priority:
        analysis.priority,

      confidence:
        analysis.confidence,

      summary:
        analysis.summary,

      departments:
        analysis.departments || [],

      disciplines:
        analysis.disciplines || [],

      technologies:
        analysis.technologies || [],

      keywords:
        analysis.keywords || [],

      suggestedActions:
        analysis.suggestedActions || [],

      duplicateCandidates:
        analysis.duplicateCandidates || [],

      institutionMatches:
        analysis.institutionMatches || [],

      processedAt:
        analysis.processedAt ||
        new Date(),

      model:
        analysis.model,

      status:
        'Completed'
    };

    // ------------------------------------------------------------
    // Update main problem category
    // ------------------------------------------------------------

    if (analysis.category) {
      problem.category =
        analysis.category;
    }

    // ------------------------------------------------------------
    // Update main problem priority
    // ------------------------------------------------------------

    if (analysis.priority) {
      problem.priority =
        analysis.priority;
    }

    // ------------------------------------------------------------
    // Save problem
    // ------------------------------------------------------------

    await problem.save();

    // ------------------------------------------------------------
    // Return response
    // ------------------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        'Problem analyzed successfully.',

      data: {
        problemId:
          problem._id,

        analysis:
          problem.aiAnalysis
      }
    });
  } catch (error) {
    console.error(
      'AI problem analysis error:',
      error
    );

    // ------------------------------------------------------------
    // Try marking analysis as Failed
    // ------------------------------------------------------------

    try {
      if (
        req.params.problemId &&
        mongoose.Types.ObjectId.isValid(
          req.params.problemId
        )
      ) {
        await Problem.findByIdAndUpdate(
          req.params.problemId,

          {
            $set: {
              'aiAnalysis.status':
                'Failed'
            }
          }
        );
      }
    } catch (updateError) {
      console.error(
        'Failed to update AI status:',
        updateError
      );
    }

    // ------------------------------------------------------------
    // Send error response
    // ------------------------------------------------------------

    return res.status(500).json({
      success: false,

      message:
        'AI analysis failed.',

      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined
    });
  }
};

// ================================================================
// SYNCHRONIZE INSTITUTIONS FROM EXISTING USERS
// ================================================================

const syncInstitutions = async (
  req,
  res,
  next
) => {
  try {
    const count =
      await syncInstitutionsFromUsers();

    return res.status(200).json({
      success: true,

      message:
        'Institutions synchronized successfully.',

      count
    });
  } catch (error) {
    console.error(
      'Institution synchronization error:',
      error
    );

    return res.status(500).json({
      success: false,

      message:
        'Failed to synchronize institutions.',

      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined
    });
  }
};

// ================================================================
// GET INSTITUTION MATCHES FOR A PROBLEM
// ================================================================

const getProblemInstitutions = async (
  req,
  res,
  next
) => {
  try {
    const {
      problemId
    } = req.params;

    // ------------------------------------------------------------
    // Validate ID
    // ------------------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        problemId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid problem ID.'
      });
    }

    // ------------------------------------------------------------
    // Find problem
    // ------------------------------------------------------------

    const problem =
      await Problem.findById(
        problemId
      ).select(
        'aiAnalysis.institutionMatches aiAnalysis.status aiAnalysis.category aiAnalysis.disciplines aiAnalysis.technologies aiAnalysis.keywords'
      );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found.'
      });
    }

    // ------------------------------------------------------------
    // Return institution matches
    // ------------------------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        problemId:
          problem._id,

        aiStatus:
          problem.aiAnalysis?.status ||
          'Pending',

        category:
          problem.aiAnalysis?.category ||
          problem.category,

        disciplines:
          problem.aiAnalysis?.disciplines ||
          [],

        technologies:
          problem.aiAnalysis?.technologies ||
          [],

        keywords:
          problem.aiAnalysis?.keywords ||
          [],

        institutions:
          problem.aiAnalysis
            ?.institutionMatches ||
          []
      }
    });
  } catch (error) {
    console.error(
      'Get problem institutions error:',
      error
    );

    return res.status(500).json({
      success: false,

      message:
        'Failed to get institution matches.',

      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined
    });
  }
};

// ================================================================
// EXPORTS
// ================================================================

module.exports = {
  analyzeProblemById,

  syncInstitutions,

  getProblemInstitutions
};