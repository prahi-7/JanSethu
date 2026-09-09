const mongoose = require('mongoose');
const { FUNDING_STATUSES } = require('../utils/constants');

const fundingSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  commitmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: FUNDING_STATUSES,
    default: 'Committed'
  },
  milestoneBased: {
    type: Boolean,
    default: false
  },
  milestones: [{
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Disbursed', 'Completed'],
      default: 'Pending'
    },
    dueDate: Date,
    disbursedAt: Date
  }],
  disbursedAmount: {
    type: Number,
    default: 0
  },
  completedAt: Date
}, {
  timestamps: true
});

// Indexes
fundingSchema.index({ project: 1 });
fundingSchema.index({ industry: 1 });
fundingSchema.index({ status: 1 });

const Funding = mongoose.model('Funding', fundingSchema);

module.exports = Funding;