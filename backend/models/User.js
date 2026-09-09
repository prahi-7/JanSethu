const mongoose = require('mongoose');
const { USER_ROLES } = require('../utils/constants');
const { hashPassword } = require('../utils/helpers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    required: [true, 'Role is required'],
    default: USER_ROLES.CITIZEN
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  address: {
    type: String,
    trim: true
  },
  university: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  organization: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  expertise: [{
    type: String,
    trim: true
  }],
  govDepartment: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ university: 1 });
userSchema.index({ department: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;