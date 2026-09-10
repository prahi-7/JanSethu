const mongoose = require('mongoose');

const institutionSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        unique: true
      },

      type: {
        type: String,

        enum: [
          'University',
          'College',
          'Research Institute',
          'Industry',
          'Other'
        ],

        default: 'University'
      },

      location: {
        type: String,
        trim: true
      },

      website: {
        type: String,
        trim: true
      },

      logo: {
        type: String,
        trim: true
      },

      departments: [
        {
          type: String,
          trim: true
        }
      ],

      researchAreas: [
        {
          type: String,
          trim: true
        }
      ],

      expertise: [
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

      projects: [
        {
          title: {
            type: String,
            trim: true
          },

          description: {
            type: String,
            trim: true
          },

          category: {
            type: String,
            trim: true
          }
        }
      ],

      source: {
        type: String,

        enum: [
          'UserProfiles',
          'Admin',
          'Imported',
          'Manual'
        ],

        default:
          'UserProfiles'
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },

    {
      timestamps: true
    }
  );

// ================================================================
// INDEXES
// ================================================================

institutionSchema.index({
  name: 1
});

institutionSchema.index({
  departments: 1
});

institutionSchema.index({
  researchAreas: 1
});

institutionSchema.index({
  expertise: 1
});

institutionSchema.index({
  technologies: 1
});

institutionSchema.index({
  keywords: 1
});

module.exports =
  mongoose.model(
    'Institution',
    institutionSchema
  );