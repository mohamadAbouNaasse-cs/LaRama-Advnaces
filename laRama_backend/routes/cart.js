const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, validationRules } = require('../middleware/validation');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.get('/', getCart);
router.post('/add', validateRequest(validationRules.addToCart), addToCart);
router.put('/items/:cart_item_id', validateRequest(validationRules.updateCartItem), updateCartItem);
router.delete('/items/:cart_item_id', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;