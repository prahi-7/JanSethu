const express = require('express');
const { body } = require('express-validator');
const { upload } = require('../config/multer');
const problemController = require('../controllers/problemController');
const auth = require('../middleware/auth');
const { isCitizen, isAdmin, isGovernment } = require('../middleware/roleCheck');
const validate = require('../middleware/validation');

const router = express.Router();

// Validation rules for creating a problem
const createProblemValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Roads', 'Water', 'Electricity', 'Sanitation', 'Healthcare', 'Education', 'Transport', 'Housing', 'Environment', 'Other'])
    .withMessage('Invalid category'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority'),
  
  body('anonymous')
    .optional()
    .isBoolean().withMessage('Anonymous must be a boolean')
];

// Validation rules for updating status
const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Under Review', 'In Progress', 'Solved', 'Rejected'])
    .withMessage('Invalid status'),
  
  body('comment')
    .optional()
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];

// Validation rules for assigning a problem
const assignProblemValidation = [
  body('assignedTo')
    .optional()
    .isMongoId().withMessage('Invalid user ID'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Department name cannot exceed 100 characters'),
  
  body('comment')
    .optional()
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];

// ============================================
// PROBLEM ROUTES
// ============================================

// ✅ Create a new problem (with file upload support)
router.post(
  '/', 
  auth, 
  isCitizen,
  // ✅ Multer middleware for file uploads
  upload.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'videos', maxCount: 5 }
  ]),
  problemController.createProblem
);

// Get all problems (with filters)
router.get(
  '/', 
  auth, 
  problemController.getProblems
);

// Get problems for map (with filters)
router.get(
  '/map', 
  auth, 
  problemController.getMapProblems
);

// Get citizen's problems
router.get(
  '/citizen/:citizenId', 
  auth, 
  problemController.getCitizenProblems
);

// Get single problem by ID
router.get(
  '/:id', 
  auth, 
  problemController.getProblemById
);

// Get problem timeline
router.get(
  '/:id/timeline', 
  auth, 
  problemController.getProblemTimeline
);

// Update problem
router.put(
  '/:id', 
  auth, 
  problemController.updateProblem
);

// Delete problem
router.delete(
  '/:id', 
  auth, 
  problemController.deleteProblem
);

// Update problem status
router.put(
  '/:id/status', 
  auth, 
  validate(updateStatusValidation), 
  problemController.updateStatus
);

// Assign problem to someone
router.put(
  '/:id/assign', 
  auth, 
  validate(assignProblemValidation), 
  problemController.assignProblem
);

module.exports = router;