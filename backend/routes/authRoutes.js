const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('role')
    .optional()
    .isIn(['citizen', 'student', 'university', 'admin', 'government', 'industry'])
    .withMessage('Invalid role selected')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
  
  body('address')
    .optional()
    .trim(),
  
  body('university')
    .optional()
    .trim(),
  
  body('department')
    .optional()
    .trim(),
  
  body('year')
    .optional()
    .trim(),
  
  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array'),
  
  body('organization')
    .optional()
    .trim(),
  
  body('designation')
    .optional()
    .trim(),
  
  body('expertise')
    .optional()
    .isArray().withMessage('Expertise must be an array')
];

router.post('/register', authLimiter, validate(registerValidation), authController.register);
router.post('/login', authLimiter, validate(loginValidation), authController.login);
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, validate(profileValidation), authController.updateProfile);
router.post('/logout', auth, authController.logout);
router.post('/refresh-token', auth, authController.refreshToken);

module.exports = router;