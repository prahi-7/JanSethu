const express = require('express');

const industryController = require('../controllers/industryController');
const auth = require('../middleware/auth');
const { isIndustry } = require('../middleware/roleCheck');

const router = express.Router();


// Dashboard
router.get(
  '/dashboard',
  auth,
  isIndustry,
  industryController.getDashboard
);


// Projects
router.get(
  '/projects',
  auth,
  isIndustry,
  industryController.getProjects
);

router.get(
  '/projects/:projectId',
  auth,
  isIndustry,
  industryController.getProjectById
);


// Problems
router.get(
  '/problems/:problemId',
  auth,
  isIndustry,
  industryController.getProblemById
);


// Mentors
router.get(
  '/mentors',
  auth,
  isIndustry,
  industryController.getMentors
);

router.post(
  '/mentors',
  auth,
  isIndustry,
  industryController.addMentor
);


// Assign mentor
router.patch(
  '/projects/:projectId/mentor',
  auth,
  isIndustry,
  industryController.assignMentor
);


// Funding
router.post(
  '/funding',
  auth,
  isIndustry,
  industryController.commitFunding
);

module.exports = router;