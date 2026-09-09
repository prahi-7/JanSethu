const mongoose = require('mongoose');

const escalationSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      unique: true
    },

    cpgramsReference: {
      type: String,
      unique: true,
      required: true
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Resolved',
        'Rejected'
      ],
      default: 'Pending'
    },

    escalatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    escalatedAt: {
      type: Date,
      default: Date.now
    },

    remarks: {
      type: String,
      default: ''
    },

    resolvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Escalation', escalationSchema);