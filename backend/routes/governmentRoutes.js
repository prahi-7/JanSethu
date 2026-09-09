const express = require('express');
const governmentController = require('../controllers/governmentController');
const auth = require('../middleware/auth');
const { isGovernment } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/dashboard', auth, isGovernment, governmentController.getDashboard);
router.get('/problems', auth, isGovernment, governmentController.getGovernmentProblems);
router.get('/problems/:id',governmentController.getGovernmentProblemById);
router.get('/stats', auth, isGovernment, governmentController.getGovernmentStats);

module.exports = router;