const mongoose = require('mongoose');

const { PROJECT_STATUSES } = require('../utils/constants');

const projectSchema = new mongoose.Schema({

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

  // Citizen problem connected to this project
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  },

  // Student team working on the project
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },

  status: {
    type: String,
    enum: PROJECT_STATUSES,
    default: 'Idea'
  },

  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Industry mentor assigned to this project
  industryMentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  university: {
    type: String,
    trim: true
  },

  // Existing Funding reference - KEEPING IT
  funding: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funding'
  },

  // Funding information for the quick industry funding flow
  fundingAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  fundingType: {
    type: String,
    default: '',
    trim: true
  },

  fundingDescription: {
    type: String,
    default: '',
    trim: true
  },

  fundedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  fundedAt: {
    type: Date
  },

  // Solution reference
  solution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solution'
  },

  // Software / Hardware
  solutionType: {
    type: String,
    enum: ['Software', 'Hardware'],
    default: 'Software'
  },

  // Files uploaded by students
  files: [{
    name: {
      type: String,
      required: true
    },

    url: {
      type: String,
      required: true
    },

    publicId: {
      type: String
    },

    resourceType: {
      type: String
    },

    format: {
      type: String
    },

    size: {
      type: Number
    }
  }],

  milestones: [{
    title: {
      type: String,
      required: true
    },

    description: String,

    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },

    dueDate: Date,

    completedAt: Date
  }],

  startDate: Date,

  endDate: Date

}, {
  timestamps: true
});

// Indexes
projectSchema.index({ status: 1 });
projectSchema.index({ problem: 1 });
projectSchema.index({ team: 1 });
projectSchema.index({ industryMentor: 1 });
projectSchema.index({ fundedBy: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;