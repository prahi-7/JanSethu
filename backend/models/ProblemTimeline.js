const mongoose = require('mongoose');
const { PROBLEM_STATUSES } = require('../utils/constants');

const problemTimelineSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  status: {
    type: String,
    enum: PROBLEM_STATUSES,
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  assignmentInfo: {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    department: {
      type: String,
      trim: true
    },
    from: { type: Date },
    to: { type: Date }
  }
}, {
  timestamps: true
});

// Indexes
problemTimelineSchema.index({ problem: 1 });
problemTimelineSchema.index({ changedBy: 1 });
problemTimelineSchema.index({ timestamp: -1 });

const ProblemTimeline = mongoose.model('ProblemTimeline', problemTimelineSchema);

module.exports = ProblemTimeline;