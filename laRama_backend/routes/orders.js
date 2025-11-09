const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, validationRules } = require('../middleware/validation');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderStats
} = require('../controllers/orderController');

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Order routes
router.post('/', validateRequest(validationRules.createOrder), createOrder);
router.get('/', getUserOrders);
router.get('/stats', getOrderStats);
router.get('/:order_id', getOrderById);

module.exports = router;