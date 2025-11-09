const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, validationRules } = require('../middleware/validation');
const {
  register,
  login,
  getProfile,
  verifyToken
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', validateRequest(validationRules.register), register);
router.post('/login', validateRequest(validationRules.login), login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/verify-token', authenticateToken, verifyToken);

module.exports = router;