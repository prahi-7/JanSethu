const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

const generateReferenceId = (prefix = 'REF') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

const formatResponse = (success, message, data = null, errors = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (errors !== null) response.errors = errors;
  return response;
};

const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isPhoneValid = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const paginate = (page = 1, limit = 10) => {
  const pageNumber = Math.max(1, parseInt(page));
  const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNumber - 1) * limitNumber;
  return { page: pageNumber, limit: limitNumber, skip };
};

const getPaginationResponse = (total, page, limit, data) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  sanitizeUser,
  generateReferenceId,
  formatResponse,
  createSlug,
  isEmailValid,
  isPhoneValid,
  paginate,
  getPaginationResponse
};