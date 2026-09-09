const mongoose = require('mongoose');
const { TEAM_STATUSES } = require('../utils/constants');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    minlength: [3, 'Team name must be at least 3 characters'],
    maxlength: [50, 'Team name cannot exceed 50 characters']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  skills: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: TEAM_STATUSES,
    default: 'Forming'
  },
  university: {
    type: String,
    trim: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  maxMembers: {
    type: Number,
    default: 6,
    min: 2,
    max: 6
  }
}, {
  timestamps: true
});

// Indexes
teamSchema.index({ status: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ members: 1 });

teamSchema.methods.addMember = async function(userId) {
  if (this.members.length >= this.maxMembers) {
    throw new Error('Team is full');
  }
  if (this.members.includes(userId)) {
    throw new Error('User already in team');
  }
  this.members.push(userId);
  return await this.save();
};

teamSchema.methods.removeMember = async function(userId) {
  this.members = this.members.filter(m => m.toString() !== userId.toString());
  return await this.save();
};

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;