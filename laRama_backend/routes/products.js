const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const {
  getAllProducts,
  getProductById,
  getCategories,
  getFeaturedProducts
} = require('../controllers/productController');

const router = express.Router();

// Public routes (with optional auth for potential user-specific features later)
router.get('/', optionalAuth, getAllProducts);
router.get('/categories', optionalAuth, getCategories);
router.get('/featured', optionalAuth, getFeaturedProducts);
router.get('/:id', optionalAuth, getProductById);

module.exports = router;