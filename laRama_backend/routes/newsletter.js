const express = require('express');
const { validateRequest, validationRules } = require('../middleware/validation');
const { optionalAuth, authenticateToken } = require('../middleware/auth');
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterStats,
  getActiveSubscribers
} = require('../controllers/newsletterController');

const router = express.Router();

/**
 * Newsletter Routes
 * 
 * Public routes:
 * - POST /subscribe - Subscribe to newsletter
 * - POST /unsubscribe - Unsubscribe from newsletter
 * 
 * Protected routes (require authentication):
 * - GET /stats - Get newsletter statistics (admin)
 * - GET /subscribers - Get active subscribers list (admin)
 */

// Public newsletter routes
router.post('/subscribe', validateRequest(validationRules.newsletter), subscribeNewsletter);
router.post('/unsubscribe', validateRequest(validationRules.newsletter), unsubscribeNewsletter);

// Protected admin routes
router.get('/stats', authenticateToken, getNewsletterStats);
router.get('/subscribers', authenticateToken, getActiveSubscribers);

module.exports = router;