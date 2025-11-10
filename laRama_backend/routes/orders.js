/**
 * @fileoverview Order Management Routes for LaRama E-commerce Platform
 * 
 * This module defines all order-related API endpoints for processing customer orders,
 * retrieving order history, viewing order details, and accessing order analytics.
 * These routes handle the complete order lifecycle from creation through tracking
 * and provide comprehensive order management functionality.
 * 
 * Authentication Requirements:
 * - All order routes require valid JWT authentication tokens
 * - User authentication middleware applied to entire router
 * - Order operations are user-specific and secured
 * 
 * Order Management Features:
 * - Secure order creation from shopping cart with transaction safety
 * - Comprehensive order history with pagination support
 * - Detailed individual order information retrieval
 * - Order analytics and statistics for user dashboards
 * - Complete order lifecycle tracking and management
 * 
 * API Endpoints:
 * - POST /api/orders - Create new order from shopping cart
 * - GET /api/orders - Retrieve user's order history with pagination
 * - GET /api/orders/stats - Get comprehensive order statistics and analytics
 * - GET /api/orders/:order_id - Retrieve detailed information for specific order
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const express = require('express');                           // Express framework for routing
const { authenticateToken } = require('../middleware/auth'); // JWT authentication middleware
const { validateRequest, validationRules } = require('../middleware/validation'); // Input validation middleware
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderStats
} = require('../controllers/orderController');               // Order management controller functions

const router = express.Router();

/**
 * Global Authentication Middleware
 * All order routes require user authentication to ensure order operations
 * are performed securely on behalf of authenticated users only
 */
router.use(authenticateToken);

/**
 * @route POST /api/orders
 * @description Create New Order from Shopping Cart
 * 
 * Converts the user's shopping cart into a confirmed order with comprehensive validation,
 * inventory management, and transaction safety. This is the core checkout functionality
 * that processes customer purchases and manages all related data consistently.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. validateRequest(validationRules.createOrder) - Validates order creation data
 * 3. createOrder - Controller function that processes order creation logic
 * 
 * Request Body Requirements:
 * - shipping_address: Complete shipping address for order delivery (required)
 * 
 * Order Creation Process:
 * 1. Validates cart has items and retrieves complete cart contents
 * 2. Performs comprehensive stock availability checking for all items
 * 3. Calculates total order amount from all cart items
 * 4. Creates order record with pending status and shipping information
 * 5. Creates individual order items preserving purchase details
 * 6. Updates product stock quantities to reflect purchases
 * 7. Clears user's shopping cart after successful order creation
 * 
 * Transaction Safety:
 * - Uses database transactions to ensure complete success or rollback
 * - Automatic rollback on any validation failure or system error
 * - Prevents partial order creation or inventory inconsistencies
 * - Maintains data integrity across multiple database operations
 * 
 * Inventory Management:
 * - Real-time stock validation before order processing
 * - Automatic stock quantity updates for purchased items
 * - Prevention of overselling through comprehensive stock checks
 * - Stock reservation during order processing
 * 
 * Use Cases:
 * - Checkout page order submission and processing
 * - Mobile checkout flows and one-click ordering
 * - Guest checkout and registered user purchases
 * - Express checkout from product pages
 * 
 * Response Data:
 * - Order confirmation with order ID and details
 * - Order total and status for customer confirmation
 * - Created timestamp for order tracking
 * 
 * Role: Core checkout functionality processing customer purchases with complete data integrity
 */
router.post('/', validateRequest(validationRules.createOrder), createOrder);

/**
 * @route GET /api/orders
 * @description Retrieve User Order History
 * 
 * Retrieves a paginated list of all orders for the authenticated user, providing
 * comprehensive order history functionality for user account pages and order
 * tracking interfaces.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. getUserOrders - Controller function that retrieves paginated order history
 * 
 * Query Parameters (all optional):
 * - page: Page number for pagination (integer, default: 1)
 * - limit: Number of orders per page (integer, default: 10)
 * 
 * Order Information Provided:
 * - Complete order details including ID, total, status, and dates
 * - Shipping address information for each order
 * - Orders sorted chronologically (newest first) for relevance
 * - Comprehensive pagination metadata for navigation
 * 
 * Pagination Features:
 * - Configurable page size with sensible defaults
 * - Total count calculation for complete pagination information
 * - Navigation flags (hasNextPage, hasPrevPage) for UI components
 * - Efficient database queries with LIMIT and OFFSET
 * 
 * Use Cases:
 * - User account order history pages
 * - Order tracking and status monitoring
 * - Re-ordering from previous purchases
 * - Customer service order lookup and support
 * 
 * Response Data Structure:
 * - orders: Array of order objects with complete information
 * - pagination: Metadata including current page, total pages, and counts
 * - Formatted monetary values for consistent display
 * 
 * Role: Provides comprehensive order history browsing with pagination for user accounts
 */
router.get('/', getUserOrders);

/**
 * @route GET /api/orders/stats
 * @description Get Order Statistics and Analytics
 * 
 * Provides comprehensive statistics about the user's order history including
 * total spending, order counts by status, and other metrics useful for
 * dashboard displays and customer insights.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. getOrderStats - Controller function that calculates comprehensive order statistics
 * 
 * Statistics Provided:
 * - Total number of orders placed by the user
 * - Total amount spent across all orders for spending analysis
 * - Order counts broken down by status (pending, processing, shipped, delivered, cancelled)
 * - Comprehensive metrics for user dashboard and account overview
 * 
 * Database Efficiency:
 * - Single optimized query using conditional COUNT aggregation
 * - COALESCE handling for users with no orders (returns 0 instead of null)
 * - Efficient status-based counting without multiple queries
 * 
 * Use Cases:
 * - User dashboard statistics and spending insights
 * - Order history overview and summary displays
 * - Customer loyalty program data and tier calculations
 * - Business analytics and customer behavior analysis
 * 
 * Response Data:
 * - total_orders: Complete count of user's orders
 * - total_spent: Lifetime spending amount for financial tracking
 * - Status breakdowns: Detailed counts for each order status
 * - Formatted numeric values for consistent display
 * 
 * Analytics Value:
 * - Customer spending pattern analysis
 * - Order fulfillment status tracking
 * - Customer engagement and loyalty metrics
 * 
 * Role: Provides comprehensive order analytics for user insights and dashboard functionality
 */
router.get('/stats', getOrderStats);

/**
 * @route GET /api/orders/:order_id
 * @description Retrieve Detailed Order Information
 * 
 * Retrieves comprehensive details for a specific order including all order items
 * and associated product information. This endpoint provides complete order
 * information for order detail pages and tracking functionality.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. getOrderById - Controller function that retrieves detailed order information
 * 
 * URL Parameters:
 * - order_id: Unique identifier of the order to retrieve
 * 
 * Detailed Information Provided:
 * - Complete order header (ID, total, status, shipping address, timestamps)
 * - Individual order items with quantities, prices, and calculated totals
 * - Associated product details for each order item (name, description, image)
 * - Handles cases where products may have been deleted after order creation
 * 
 * Security Features:
 * - Order ownership validation (users can only access their own orders)
 * - Proper error handling for non-existent orders
 * - Protection against unauthorized order access
 * 
 * Data Handling:
 * - LEFT JOIN preserves order items even if products are deleted
 * - Proper null handling for deleted or unavailable products
 * - Formatted numeric values for consistent monetary display
 * - Complete order item details for invoicing and tracking
 * 
 * Use Cases:
 * - Order detail pages with comprehensive information display
 * - Order tracking and status monitoring interfaces
 * - Customer service order investigation and support
 * - Invoice generation and order documentation
 * - Re-ordering functionality from order history
 * 
 * Response Data Structure:
 * - Complete order object with embedded items array
 * - Product information for each order item (when available)
 * - Calculated totals and formatted monetary values
 * - Timestamps for order lifecycle tracking
 * 
 * Error Handling:
 * - 404 for non-existent orders or unauthorized access
 * - Graceful handling of deleted products in order items
 * - Clear error messages for debugging and user feedback
 * 
 * Role: Provides complete order details for tracking, customer service, and order management
 */
router.get('/:order_id', getOrderById);

module.exports = router;