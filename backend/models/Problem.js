const mongoose = require('mongoose');

const {
  PROBLEM_CATEGORIES,
  PROBLEM_STATUSES,
  PROBLEM_PRIORITIES
} = require('../utils/constants');

const problemSchema = new mongoose.Schema(
  {
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
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },

    category: {
      type: String,
      enum: PROBLEM_CATEGORIES,
      required: [true, 'Category is required']
    },

    priority: {
      type: String,
      enum: PROBLEM_PRIORITIES,
      default: 'Medium'
    },

    status: {
      type: String,
      enum: PROBLEM_STATUSES,
      default: 'Pending'
    },

    anonymous: {
      type: Boolean,
      default: false
    },

    location: {
      lat: {
        type: Number,
        required: true
      },

      lng: {
        type: Number,
        required: true
      },

      address: {
        type: String,
        trim: true
      }
    },

    photos: [
      {
        type: String,
        trim: true
      }
    ],

    videos: [
      {
        type: String,
        trim: true
      }
    ],

    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    assignedDepartment: {
      type: String,
      trim: true
    },

    resolution: {
      summary: {
        type: String,
        trim: true
      },

      date: {
        type: Date
      },

      solvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },

    // ============================================================
    // AI ANALYSIS
    // ============================================================

    aiAnalysis: {
      category: {
        type: String,
        trim: true
      },

      priority: {
        type: String,
        trim: true
      },

      confidence: {
        type: Number,
        min: 0,
        max: 1
      },

      summary: {
        type: String,
        trim: true
      },

      departments: [
        {
          type: String,
          trim: true
        }
      ],

      disciplines: [
        {
          type: String,
          trim: true
        }
      ],

      technologies: [
        {
          type: String,
          trim: true
        }
      ],

      keywords: [
        {
          type: String,
          trim: true
        }
      ],

      suggestedActions: [
        {
          type: String,
          trim: true
        }
      ],

      // ==========================================================
      // POSSIBLE DUPLICATE PROBLEMS
      // ==========================================================

      duplicateCandidates: [
        {
          problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem'
          },

          similarity: {
            type: Number,
            min: 0,
            max: 1
          },

          reason: {
            type: String,
            trim: true
          }
        }
      ],

      // ==========================================================
      // AI → UNIVERSITY / INSTITUTION MATCHING
      // ==========================================================

      institutionMatches: [
        {
          institutionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Institution'
          },

          name: {
            type: String,
            trim: true
          },

          type: {
            type: String,
            trim: true
          },

          location: {
            type: String,
            trim: true
          },

          website: {
            type: String,
            trim: true
          },

          // Relevance percentage from 0–100
          matchScore: {
            type: Number,
            min: 0,
            max: 100
          },

          // Matching research / discipline areas
          matchedAreas: [
            {
              type: String,
              trim: true
            }
          ],

          // Matching technologies / skills
          matchedTechnologies: [
            {
              type: String,
              trim: true
            }
          ],

          // Matching academic departments
          matchedDepartments: [
            {
              type: String,
              trim: true
            }
          ],

          // Human-readable explanation
          reasons: [
            {
              type: String,
              trim: true
            }
          ],

          // Number of active student profiles
          // associated with this institution
          studentCount: {
            type: Number,
            default: 0
          }
        }
      ],

      processedAt: {
        type: Date
      },

      model: {
        type: String
      },

      status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
      }
    },

    // ============================================================
    // CPGRAMS / ESCALATION
    // ============================================================

    cpgramsReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Escalation'
    },

    // ============================================================
    // ENGAGEMENT
    // ============================================================

    views: {
      type: Number,
      default: 0
    },

    upvotes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// ================================================================
// INDEXES
// ================================================================

problemSchema.index({
  category: 1
});

problemSchema.index({
  status: 1
});

problemSchema.index({
  priority: 1
});

problemSchema.index({
  citizen: 1
});

problemSchema.index({
  createdAt: -1
});

problemSchema.index({
  'location.lat': 1,
  'location.lng': 1
});

problemSchema.index({
  'aiAnalysis.category': 1
});

problemSchema.index({
  'aiAnalysis.status': 1
});

// ================================================================
// TIMELINE VIRTUAL
// ================================================================

problemSchema.virtual('timeline', {
  ref: 'ProblemTimeline',
  localField: '_id',
  foreignField: 'problem'
});

// ================================================================
// INSTANCE METHOD: UPDATE STATUS
// ================================================================

problemSchema.methods.updateStatus = async function (
  newStatus,
  userId,
  comment = ''
) {
  this.status = newStatus;

  await this.save();

  const Timeline =
    mongoose.model('ProblemTimeline');

  await Timeline.create({
    problem: this._id,
    status: newStatus,
    changedBy: userId,
    comment: comment
  });

  return this;
};

// ================================================================
// INSTANCE METHOD: ASSIGN PROBLEM
// ================================================================

problemSchema.methods.assignTo = async function (
  userId,
  department,
  comment = ''
) {
  this.assignedTo = userId;

  this.assignedDepartment = department;

  await this.save();

  const Timeline =
    mongoose.model('ProblemTimeline');

  await Timeline.create({
    problem: this._id,
    status: this.status,
    changedBy: userId,
    comment: comment,

    assignmentInfo: {
      assignedTo: userId,
      department: department
    }
  });

  return this;
};

// ================================================================
// STATIC METHOD: GET STATISTICS
// ================================================================

problemSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,

        total: {
          $sum: 1
        },

        pending: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'Pending']
              },
              1,
              0
            ]
          }
        },

        underReview: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'Under Review']
              },
              1,
              0
            ]
          }
        },

        inProgress: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'In Progress']
              },
              1,
              0
            ]
          }
        },

        solved: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'Solved']
              },
              1,
              0
            ]
          }
        },

        rejected: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'Rejected']
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  return (
    stats[0] || {
      total: 0,
      pending: 0,
      underReview: 0,
      inProgress: 0,
      solved: 0,
      rejected: 0
    }
  );
};

// ================================================================
// STATIC METHOD: CATEGORY DISTRIBUTION
// ================================================================

problemSchema.statics.getCategoryDistribution =
  async function () {
    return await this.aggregate([
      {
        $group: {
          _id: '$category',
          count: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          count: -1
        }
      }
    ]);
  };

// ================================================================
// STATIC METHOD: PRIORITY DISTRIBUTION
// ================================================================

problemSchema.statics.getPriorityDistribution =
  async function () {
    return await this.aggregate([
      {
        $group: {
          _id: '$priority',
          count: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          count: -1
        }
      }
    ]);
  };

// ================================================================
// JSON TRANSFORM
// ================================================================

problemSchema.set('toJSON', {
  virtuals: true,

  transform: function (doc, ret) {
    delete ret.__v;

    return ret;
  }
});

// ================================================================
// MODEL
// ================================================================

const Problem =
  mongoose.model(
    'Problem',
    problemSchema
  );

module.exports = Problem;