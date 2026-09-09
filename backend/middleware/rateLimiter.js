const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message = 'Too many requests') => {
  return rateLimit({
    windowMs: windowMs || parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
    max: max || parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
      success: false,
      message: `${message}. Please try again later.`,
      errors: ['Rate limit exceeded']
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const generalLimiter = createRateLimiter(15 * 60 * 1000, 100);
const authLimiter = createRateLimiter(15 * 60 * 1000, 20);
const uploadLimiter = createRateLimiter(60 * 60 * 1000, 50);
const aiLimiter = createRateLimiter(60 * 60 * 1000, 30);

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  aiLimiter,
  createRateLimiter
};