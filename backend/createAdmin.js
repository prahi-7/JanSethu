require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/database');
const { USER_ROLES } = require('./utils/constants');

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@jansethu.com';
    const adminPassword = 'Admin@123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('❌ Admin already exists.');
      console.log('Email:', adminEmail);
      process.exit(0);
    }

    // Create admin
    const admin = new User({
      name: 'JanSetu Admin',
      email: adminEmail,
      password: adminPassword,
      role: USER_ROLES.ADMIN,
      profileComplete: true,
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin account created successfully!');
    console.log('--------------------------------');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role:', USER_ROLES.ADMIN);
    console.log('--------------------------------');

    process.exit(0);

  } catch (error) {
    console.error('❌ Failed to create admin:', error);
    process.exit(1);
  }
};

createAdmin();