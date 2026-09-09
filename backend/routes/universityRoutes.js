const express = require('express');
const universityController = require('../controllers/universityController');
const auth = require('../middleware/auth');
const { isUniversity } = require('../middleware/roleCheck');

const router = express.Router();

router.get(
  '/dashboard',
  auth,
  isUniversity,
  universityController.getDashboard
);

router.get(
  '/students',
  auth,
  isUniversity,
  universityController.getStudents
);

router.get(
  '/problems',
  auth,
  isUniversity,
  universityController.getCitizenProblems
);

module.exports = router;