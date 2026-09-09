const Escalation = require('../models/Escalation');
const Problem = require('../models/Problem');


// Get problems eligible for CPGRAMS escalation
const getPendingEscalations = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const escalatedProblemIds = await Escalation
      .find()
      .distinct('problem');

    const problems = await Problem.find({
      _id: { $nin: escalatedProblemIds },
      createdAt: { $lte: sevenDaysAgo },
      status: {
        $nin: ['Solved', 'Rejected']
      }
    })
      .populate('citizen', 'name email')
      .sort({ createdAt: 1 });

    const formatted = problems.map(problem => ({
      ...problem.toObject(),
      problemId: problem._id,
      pendingDays: Math.floor(
        (Date.now() - problem.createdAt.getTime()) /
        (1000 * 60 * 60 * 24)
      )
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.error('Get pending escalations error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending escalations'
    });
  }
};


// Get all escalated problems
const getEscalatedProblems = async (req, res) => {
  try {

    const escalations = await Escalation.find()
      .populate({
        path: 'problem',
        populate: {
          path: 'citizen',
          select: 'name email'
        }
      })
      .populate('escalatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: escalations
    });

  } catch (error) {

    console.error('Get escalated problems error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch escalations'
    });
  }
};


// Escalate problem to CPGRAMS
const createEscalation = async (req, res) => {
  try {

    const { problemId, remarks } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: 'Problem ID is required'
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    if (
      problem.status === 'Solved' ||
      problem.status === 'Rejected'
    ) {
      return res.status(400).json({
        success: false,
        message: 'This problem cannot be escalated'
      });
    }

    const existing = await Escalation.findOne({
      problem: problemId
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Problem is already escalated'
      });
    }

    // Demo CPGRAMS reference number
    const reference =
      `CPGRAMS-${Date.now().toString().slice(-8)}`;

    const escalation = await Escalation.create({
      problem: problemId,
      cpgramsReference: reference,
      status: 'Processing',
      escalatedBy: req.userId,
      remarks: remarks || ''
    });

    // Store reference on problem
    problem.cpgramsReference = escalation._id;

    await problem.save();

    const populated = await Escalation.findById(
      escalation._id
    )
      .populate('problem')
      .populate('escalatedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Problem escalated to CPGRAMS successfully',
      data: populated
    });

  } catch (error) {

    console.error('Create escalation error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to escalate problem'
    });
  }
};


// Update escalation status
const updateEscalationStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status, remarks } = req.body;

    const allowedStatuses = [
      'Pending',
      'Processing',
      'Resolved',
      'Rejected'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid escalation status'
      });
    }

    const escalation = await Escalation.findById(id);

    if (!escalation) {
      return res.status(404).json({
        success: false,
        message: 'Escalation not found'
      });
    }

    escalation.status = status;

    if (remarks !== undefined) {
      escalation.remarks = remarks;
    }

    if (status === 'Resolved') {
      escalation.resolvedAt = new Date();
    }

    await escalation.save();

    res.json({
      success: true,
      message: 'Escalation status updated',
      data: escalation
    });

  } catch (error) {

    console.error('Update escalation status error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update escalation status'
    });
  }
};


module.exports = {
  getPendingEscalations,
  getEscalatedProblems,
  createEscalation,
  updateEscalationStatus
};