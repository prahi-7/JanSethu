const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

// ==================== DASHBOARD ====================
router.get('/stats', auth, isAdmin, adminController.getStats);


// ==================== USER MANAGEMENT ====================
router.get('/users', auth, isAdmin, adminController.getUsers);
router.get('/users/:id', auth, isAdmin, adminController.getUserById);
router.put('/users/:id', auth, isAdmin, adminController.updateUser);
router.delete('/users/:id', auth, isAdmin, adminController.deleteUser);


// ==================== PROBLEM MANAGEMENT ====================
router.get('/problems', auth, isAdmin, adminController.getAdminProblems);
router.put(
  '/problems/:id/status',
  auth,
  isAdmin,
  adminController.updateProblemStatus
);

// Delete a problem
router.delete('/problems/:id', auth, isAdmin, adminController.deleteProblem);


module.exports = router;