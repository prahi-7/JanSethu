const mongoose = require('mongoose');
const { SOLUTION_STATUSES } = require('../utils/constants');

const solutionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: SOLUTION_STATUSES,
    default: 'Proposed'
  },
  implementation: {
    approach: { type: String },
    technologies: [{ type: String }],
    timeline: { type: Number, min: 1, max: 52 } // in weeks
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    type: String
  }],
  implementedAt: Date
}, {
  timestamps: true
});

// Indexes
solutionSchema.index({ status: 1 });
solutionSchema.index({ problem: 1 });
solutionSchema.index({ project: 1 });
solutionSchema.index({ submittedBy: 1 });

solutionSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;