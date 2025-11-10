/**
 * @fileoverview Product Management Controller for LaRama E-commerce Platform
 * 
 * This controller handles all product-related operations including product retrieval,
 * filtering, search functionality, categorization, and featured product management.
 * It provides comprehensive product catalog functionality for the LaRama handcrafted
 * products business with advanced querying and pagination capabilities.
 * 
 * Key Features:
 * - Product catalog browsing with pagination
 * - Advanced filtering by category and search terms
 * - Individual product retrieval with detailed information
 * - Category listing with product counts
 * - Featured products showcase for homepage
 * - Comprehensive error handling and logging
 * 
 * Database Integration:
 * - PostgreSQL queries with parameterized statements for security
 * - Efficient pagination for large product catalogs
 * - Category-based organization and filtering
 * - Search functionality across product names and descriptions
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const { pool } = require('../config/database'); // PostgreSQL database connection pool

/**
 * Get All Products Controller with Advanced Filtering
 * 
 * Retrieves a paginated list of products with optional filtering by category
 * and search terms. This is the main product catalog endpoint that powers
 * the product listing pages with comprehensive query capabilities.
 * 
 * @param {Object} req - Express request object containing query parameters
 * @param {Object} res - Express response object for sending product data
 * 
 * Query Parameters:
 * - category: Filter products by specific category (optional)
 * - page: Page number for pagination (default: 1)
 * - limit: Number of products per page (default: 10)
 * - search: Search term for name/description matching (optional)
 * 
 * Advanced Features:
 * - Dynamic SQL query building based on provided filters
 * - Parameterized queries to prevent SQL injection attacks
 * - Case-insensitive search using ILIKE for user-friendly matching
 * - Comprehensive pagination with total counts and page metadata
 * - Only active products are returned to hide disabled items
 * 
 * Response Structure:
 * - products: Array of product objects with complete information
 * - pagination: Metadata including current page, total pages, and navigation flags
 * 
 * Database Performance:
 * - Uses LIMIT and OFFSET for efficient pagination
 * - Separate count query for total product calculation
 * - Ordered by creation date (newest first) for relevance
 * 
 * Role: Primary product catalog endpoint supporting e-commerce browsing experience
 */
const getAllProducts = async (req, res) => {
  try {
    /**
     * Query Parameter Extraction and Defaults
     * Extracts filtering and pagination parameters with sensible defaults
     */
    const { category, page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    /**
     * Dynamic SQL Query Construction
     * Builds a flexible query that adapts to provided filters while maintaining security
     */
    let query = `
      SELECT id, name, description, price, image_url, category, stock_quantity, 
             is_active, created_at, updated_at
      FROM products 
      WHERE is_active = true
    `;
    const queryParams = [];
    let paramCount = 0;

    /**
     * Category Filtering Logic
     * Adds category-specific filtering when category parameter is provided
     */
    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      queryParams.push(category);
    }

    /**
     * Search Functionality Implementation
     * Implements case-insensitive search across product names and descriptions
     * Uses ILIKE for PostgreSQL case-insensitive pattern matching
     */
    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    /**
     * Pagination and Ordering Application
     * Adds sorting by creation date and pagination limits to the query
     */
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    /**
     * Total Count Calculation for Pagination Metadata
     * Executes a separate count query with the same filters to calculate pagination info
     */
    let countQuery = 'SELECT COUNT(*) FROM products WHERE is_active = true';
    const countParams = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (name ILIKE $${countParamCount} OR description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalProducts = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalProducts / limit);

    /**
     * Comprehensive Response with Pagination Metadata
     * Returns products data along with detailed pagination information for frontend
     */
    res.json({
      success: true,
      data: {
        products: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products'
    });
  }
};

/**
 * Get Individual Product Controller
 * 
 * Retrieves detailed information for a specific product by its unique identifier.
 * This endpoint is used for product detail pages where users need comprehensive
 * product information for viewing and purchasing decisions.
 * 
 * @param {Object} req - Express request object containing product ID parameter
 * @param {Object} res - Express response object for sending product details
 * 
 * URL Parameter Requirements:
 * - id: Unique product identifier (UUID or integer based on database schema)
 * 
 * Product Information Returned:
 * - Complete product details including name, description, and pricing
 * - Image URL for product display
 * - Category and stock quantity for inventory management
 * - Timestamps for creation and last update tracking
 * 
 * Security Features:
 * - Only returns active products (is_active = true)
 * - Parameterized query to prevent SQL injection
 * - Proper error handling for non-existent products
 * 
 * Response Scenarios:
 * - Success (200): Complete product information
 * - Not Found (404): Product doesn't exist or is inactive
 * - Server Error (500): Database or system errors
 * 
 * Role: Provides detailed product information for individual product pages
 */
const getProductById = async (req, res) => {
  try {
    /**
     * Product ID Parameter Extraction
     * Gets the product identifier from the URL parameters
     */
    const { id } = req.params;

    /**
     * Product Database Query
     * Retrieves complete product information using parameterized query for security
     * Only returns active products to hide disabled/deleted items
     */
    const result = await pool.query(
      `SELECT id, name, description, price, image_url, category, stock_quantity, 
              is_active, created_at, updated_at
       FROM products 
       WHERE id = $1 AND is_active = true`,
      [id]
    );

    /**
     * Product Existence Validation
     * Checks if product was found and returns appropriate error if not
     */
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    /**
     * Successful Product Data Response
     * Returns complete product information for frontend display
     */
    res.json({
      success: true,
      data: {
        product: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product'
    });
  }
};

/**
 * Product Categories Controller
 * 
 * Retrieves all available product categories with their respective product counts.
 * This endpoint is used for category navigation, filtering interfaces, and
 * displaying category-based browsing options to users.
 * 
 * @param {Object} req - Express request object (no parameters required)
 * @param {Object} res - Express response object for sending category data
 * 
 * Category Information Provided:
 * - Distinct category names from the product catalog
 * - Product count for each category showing inventory depth
 * - Alphabetically sorted categories for consistent display
 * 
 * Database Query Features:
 * - DISTINCT ensures no duplicate categories
 * - COUNT aggregation provides product quantities per category
 * - GROUP BY organizes results by category
 * - Filters out inactive products and null categories
 * - Alphabetical ordering for user-friendly navigation
 * 
 * Use Cases:
 * - Category dropdown menus in navigation
 * - Product filtering interfaces
 * - Category-based landing pages
 * - Inventory management and reporting
 * 
 * Role: Provides category structure for product organization and navigation
 */
const getCategories = async (req, res) => {
  try {
    /**
     * Category Aggregation Query
     * Retrieves unique categories with product counts for each category
     * Only includes active products and excludes empty categories
     */
    const result = await pool.query(
      `SELECT DISTINCT category, COUNT(*) as product_count
       FROM products 
       WHERE is_active = true AND category IS NOT NULL
       GROUP BY category
       ORDER BY category`
    );

    res.json({
      success: true,
      data: {
        categories: result.rows
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
};

/**
 * Featured Products Controller
 * 
 * Retrieves a curated selection of featured products for homepage display and
 * promotional purposes. These are typically the newest or most popular products
 * that showcase the best of LaRama's handcrafted collection.
 * 
 * @param {Object} req - Express request object with optional limit parameter
 * @param {Object} res - Express response object for sending featured products
 * 
 * Query Parameters:
 * - limit: Maximum number of featured products to return (default: 6)
 * 
 * Product Selection Criteria:
 * - Only active products are included
 * - Ordered by creation date (newest first) for freshness
 * - Configurable limit for different display contexts
 * 
 * Featured Product Information:
 * - Complete product details for display and interaction
 * - All necessary data for product cards and quick previews
 * - Recent products to highlight new additions to the catalog
 * 
 * Use Cases:
 * - Homepage hero sections and product showcases
 * - "New Arrivals" sections
 * - Marketing promotional displays
 * - Quick product previews for browsing
 * 
 * Role: Highlights newest and most attractive products for marketing and engagement
 */
const getFeaturedProducts = async (req, res) => {
  try {
    /**
     * Featured Products Limit Configuration
     * Allows customization of how many featured products to display
     */
    const { limit = 6 } = req.query;

    /**
     * Featured Products Query
     * Retrieves most recent active products for promotional display
     * Ordered by creation date to showcase newest additions
     */
    const result = await pool.query(
      `SELECT id, name, description, price, image_url, category, stock_quantity, 
              created_at, updated_at
       FROM products 
       WHERE is_active = true
       ORDER BY created_at DESC
       LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: {
        products: result.rows
      }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured products'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  getFeaturedProducts
};