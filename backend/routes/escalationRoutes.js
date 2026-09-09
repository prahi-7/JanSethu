const express = require('express');

const router = express.Router();

const {
  getPendingEscalations,
  getEscalatedProblems,
  createEscalation,
  updateEscalationStatus
} = require('../controllers/escalationController');

const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');


// Get problems pending for more than 7 days
router.get(
  '/pending',
  auth,
  isAdmin,
  getPendingEscalations
);


// Get all escalated problems
router.get(
  '/',
  auth,
  isAdmin,
  getEscalatedProblems
);


// Escalate a problem to CPGRAMS
router.post(
  '/',
  auth,
  isAdmin,
  createEscalation
);


// Update CPGRAMS escalation status
router.put(
  '/:id/status',
  auth,
  isAdmin,
  updateEscalationStatus
);


module.exports = router;