const mongoose = require('mongoose');

const teamInvitationSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    matchedSkills: {
      type: [String],
      default: []
    },

    reason: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Declined',
        'Expired'
      ],
      default: 'Pending'
    },

    sentAt: {
      type: Date,
      default: Date.now
    },

    respondedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
teamInvitationSchema.index({
  receiver: 1,
  status: 1
});

teamInvitationSchema.index({
  sender: 1,
  status: 1
});

teamInvitationSchema.index({
  team: 1,
  receiver: 1
});

teamInvitationSchema.index({
  problem: 1
});

const TeamInvitation = mongoose.model(
  'TeamInvitation',
  teamInvitationSchema
);

module.exports = TeamInvitation;