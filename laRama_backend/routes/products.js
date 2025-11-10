/**
 * @fileoverview Product Routes for LaRama E-commerce Platform
 * 
 * This module defines all product-related API endpoints for browsing, searching, and
 * retrieving product information. These routes power the product catalog functionality
 * and support the core e-commerce browsing experience for LaRama's handcrafted products.
 * 
 * Route Characteristics:
 * - All routes are public (no authentication required for browsing)
 * - Optional authentication middleware for future user-specific features
 * - Comprehensive product catalog functionality
 * - Search and filtering capabilities for enhanced user experience
 * 
 * Product Catalog Features:
 * - Product listing with advanced filtering and pagination
 * - Category-based product organization and navigation
 * - Featured products for marketing and homepage display
 * - Individual product detail retrieval for product pages
 * 
 * API Endpoints:
 * - GET /api/products - Retrieve all products with filtering and pagination
 * - GET /api/products/categories - Get available product categories with counts
 * - GET /api/products/featured - Retrieve featured products for promotional display
 * - GET /api/products/:id - Get detailed information for specific product
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const express = require('express');                    // Express framework for routing
const { optionalAuth } = require('../middleware/auth'); // Optional authentication middleware for future features
const {
  getAllProducts,
  getProductById,
  getCategories,
  getFeaturedProducts
} = require('../controllers/productController');       // Product controller functions

const router = express.Router();

/**
 * Public Product Routes
 * These endpoints are accessible without authentication to enable product browsing
 * Optional authentication middleware is included for potential future user-specific features
 */

/**
 * @route GET /api/products
 * @description Product Catalog Listing Endpoint
 * 
 * Retrieves a paginated and filterable list of all active products in the LaRama catalog.
 * This is the primary endpoint for product browsing pages with comprehensive search
 * and filtering capabilities.
 * 
 * Middleware Stack:
 * 1. optionalAuth - Optional authentication for potential user-specific features
 * 2. getAllProducts - Controller function that handles product retrieval and filtering
 * 
 * Query Parameters (all optional):
 * - category: Filter products by specific category (string)
 * - page: Page number for pagination (integer, default: 1)
 * - limit: Number of products per page (integer, default: 10)
 * - search: Search term for product names and descriptions (string)
 * 
 * Advanced Features:
 * - Dynamic SQL query building based on provided filters
 * - Case-insensitive search across product names and descriptions
 * - Comprehensive pagination with metadata for navigation
 * - Only returns active products (hides disabled/deleted items)
 * - Ordered by creation date for relevance (newest first)
 * 
 * Response Data:
 * - Array of product objects with complete information
 * - Pagination metadata including current page, total pages, and navigation flags
 * - Product details: ID, name, description, price, image, category, stock
 * 
 * Use Cases:
 * - Main product listing pages
 * - Category-specific product browsing
 * - Product search functionality
 * - Pagination for large product catalogs
 * 
 * Role: Primary product catalog endpoint supporting comprehensive e-commerce browsing
 */
router.get('/', optionalAuth, getAllProducts);

/**
 * @route GET /api/products/categories
 * @description Product Categories Listing Endpoint
 * 
 * Retrieves all available product categories with their respective product counts.
 * This endpoint enables category-based navigation and filtering interfaces throughout
 * the e-commerce platform.
 * 
 * Middleware Stack:
 * 1. optionalAuth - Optional authentication for potential user-specific features
 * 2. getCategories - Controller function that retrieves category information
 * 
 * Category Information:
 * - Distinct category names from the active product catalog
 * - Product count for each category showing inventory depth
 * - Alphabetically sorted categories for consistent display
 * - Excludes categories with no active products
 * 
 * Response Data:
 * - Array of category objects containing name and product count
 * - Only includes categories that have active products
 * - Sorted alphabetically for user-friendly navigation
 * 
 * Use Cases:
 * - Category dropdown menus in navigation bars
 * - Product filtering interfaces and sidebars
 * - Category-based landing pages
 * - Inventory organization and product browsing aids
 * 
 * Database Efficiency:
 * - Single query with DISTINCT and COUNT aggregation
 * - Filters out inactive products and empty categories
 * - Optimized for frequent category navigation requests
 * 
 * Role: Provides category structure for product organization and navigation systems
 */
router.get('/categories', optionalAuth, getCategories);

/**
 * @route GET /api/products/featured
 * @description Featured Products Endpoint
 * 
 * Retrieves a curated selection of featured products for homepage display and
 * promotional purposes. These products showcase the best and newest items from
 * LaRama's handcrafted collection.
 * 
 * Middleware Stack:
 * 1. optionalAuth - Optional authentication for potential user-specific features
 * 2. getFeaturedProducts - Controller function that retrieves featured products
 * 
 * Query Parameters (optional):
 * - limit: Maximum number of featured products to return (integer, default: 6)
 * 
 * Product Selection Criteria:
 * - Only active products are included for availability
 * - Ordered by creation date (newest first) for freshness
 * - Configurable limit for different display contexts and layouts
 * - Complete product information for immediate display
 * 
 * Response Data:
 * - Array of featured product objects with full details
 * - Recent products highlighting new additions to the catalog
 * - All necessary data for product cards and promotional displays
 * 
 * Use Cases:
 * - Homepage hero sections and product showcases
 * - "New Arrivals" promotional sections
 * - Marketing banners and featured product carousels
 * - Quick product previews for customer engagement
 * 
 * Marketing Features:
 * - Highlights newest products for customer discovery
 * - Configurable display count for different layouts
 * - Complete product data ready for immediate interaction
 * 
 * Role: Showcases newest and most attractive products for marketing and customer engagement
 */
router.get('/featured', optionalAuth, getFeaturedProducts);

/**
 * @route GET /api/products/:id
 * @description Individual Product Detail Endpoint
 * 
 * Retrieves comprehensive information for a specific product by its unique identifier.
 * This endpoint powers product detail pages where customers view complete product
 * information before making purchase decisions.
 * 
 * Middleware Stack:
 * 1. optionalAuth - Optional authentication for potential user-specific features
 * 2. getProductById - Controller function that retrieves specific product details
 * 
 * URL Parameters:
 * - id: Unique product identifier (UUID or integer based on database schema)
 * 
 * Product Information Retrieved:
 * - Complete product details including name, description, and pricing
 * - High-resolution image URL for product display
 * - Category classification and current stock quantity
 * - Creation and update timestamps for freshness tracking
 * 
 * Security and Validation:
 * - Only returns active products (inactive products return 404)
 * - Parameterized query to prevent SQL injection attacks
 * - Proper error handling for non-existent or inactive products
 * 
 * Response Data:
 * - Single product object with complete information
 * - All data necessary for product detail page display
 * - Stock availability information for purchase decisions
 * 
 * Use Cases:
 * - Product detail pages with comprehensive information
 * - Quick product lookups for comparison features
 * - Product information for shopping cart and checkout processes
 * - Administrative product review and management
 * 
 * Error Handling:
 * - Returns 404 for non-existent or inactive products
 * - Provides clear error messages for debugging
 * - Maintains security by not revealing system internals
 * 
 * Role: Provides detailed product information for individual product pages and customer decision-making
 */
router.get('/:id', optionalAuth, getProductById);

module.exports = router;