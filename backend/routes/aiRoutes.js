const express = require('express');

const router =
  express.Router();

const auth =
  require('../middleware/auth');

const aiController =
  require('../controllers/aiController');

// ================================================================
// ANALYZE PROBLEM
// ================================================================

router.post(
  '/analyze-problem/:problemId',
  auth,
  aiController.analyzeProblemById
);

// ================================================================
// SYNCHRONIZE UNIVERSITIES / INSTITUTIONS
// ================================================================

router.post(
  '/sync-institutions',
  auth,
  aiController.syncInstitutions
);

// ================================================================
// GET INSTITUTION MATCHES
// ================================================================

router.get(
  '/problem/:problemId/institutions',
  auth,
  aiController.getProblemInstitutions
);

module.exports = router;