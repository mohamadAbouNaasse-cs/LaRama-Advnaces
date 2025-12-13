/**
 * @fileoverview Order Management Controller for LaRama E-commerce Platform
 * 
 * This controller handles all order-related operations including order creation from cart,
 * order history retrieval, individual order details, and order statistics.
 * It provides comprehensive order management functionality with transaction safety,
 * inventory management, and detailed order tracking for the e-commerce platform.
 * 
 * Key Features:
 * - Secure order creation from shopping cart with stock validation
 * - Comprehensive order history with pagination
 * - Detailed individual order information retrieval
 * - Order statistics and analytics for user dashboards
 * - Transaction safety ensuring data consistency
 * - Automatic inventory management during order creation
 * 
 * Business Logic:
 * - Validates cart contents before order creation
 * - Manages product stock levels automatically
 * - Clears cart after successful order creation
 * - Tracks order status throughout fulfillment process
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const { pool } = require('../config/database'); // PostgreSQL database connection pool

/**
 * Create Order from Shopping Cart Controller
 * 
 * Converts a user's shopping cart into a confirmed order with comprehensive validation,
 * inventory management, and transaction safety. This is the core checkout functionality
 * that processes customer purchases and updates all related data consistently.
 * 
 * @param {Object} req - Express request object with user data and shipping information
 * @param {Object} res - Express response object for sending order creation results
 * 
 * Request Body Requirements:
 * - shipping_address: Complete shipping address for order delivery
 * 
 * Order Creation Process:
 * 1. Validates cart has items and retrieves cart contents with product details
 * 2. Checks stock availability for all cart items before processing
 * 3. Calculates total order amount from all cart items
 * 4. Creates order record with pending status
 * 5. Creates individual order items for each cart product
 * 6. Updates product stock quantities to reflect purchase
 * 7. Clears user's cart after successful order creation
 * 
 * Transaction Safety:
 * - Uses database transactions to ensure atomicity
 * - Automatic rollback on any validation failure or error
 * - Prevents partial order creation or stock inconsistencies
 * 
 * Inventory Management:
 * - Real-time stock validation before order creation
 * - Automatic stock quantity updates for purchased items
 * - Prevents overselling through comprehensive stock checks
 * 
 * Role: Core checkout functionality that processes customer purchases securely and completely
 */
const createOrder = async (req, res) => {
  /**
   * Database Transaction Setup
   * Establishes dedicated connection for transaction safety during order creation
   */
  const client = await pool.connect();
  
  try {
    /**
     * Transaction Initialization
     * Begins database transaction to ensure all operations complete successfully or none at all
     */
    await client.query('BEGIN');
    
    const userId = req.user.id;
    const { shipping_address } = req.body;

    /**
     * Cart Content Retrieval with Product Details
     * Gets all cart items with complete product information needed for order processing
     */
    const cartQuery = `
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        p.id as product_id,
        p.name as product_name,
        p.price,
        p.stock_quantity,
        (ci.quantity * p.price) as item_total
      FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      JOIN products p ON ci.product_id = p.id AND p.is_active = true
      WHERE c.user_id = $1
    `;

    const cartResult = await client.query(cartQuery, [userId]);

    /**
     * Empty Cart Validation
     * Prevents order creation from empty carts
     */
    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    /**
     * Comprehensive Stock Availability Validation
     * Checks all items for sufficient stock before processing order
     */
    const stockIssues = [];
    for (const item of cartResult.rows) {
      if (item.quantity > item.stock_quantity) {
        stockIssues.push(`${item.product_name}: requested ${item.quantity}, available ${item.stock_quantity}`);
      }
    }

    if (stockIssues.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for some items',
        stock_issues: stockIssues
      });
    }

    /**
     * Order Total Calculation
     * Calculates total order amount from all cart items
     */
    const totalAmount = cartResult.rows.reduce((sum, item) => sum + parseFloat(item.item_total), 0);

    /**
     * Order Record Creation
     * Creates the main order record with calculated total and shipping information
     */
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, status) 
       VALUES ($1, $2, $3, 'pending') 
       RETURNING id, total_amount, status, created_at`,
      [userId, totalAmount, shipping_address]
    );

    const order = orderResult.rows[0];

    /**
     * Order Items Creation and Inventory Management
     * Creates individual order items and updates product stock levels
     */
    for (const item of cartResult.rows) {
      /**
       * Order Item Creation
       * Creates detailed record for each product in the order
       */
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      /**
       * Inventory Stock Update
       * Decreases product stock quantities to reflect the purchase
       * Additional safety: ensure stock never goes negative even under concurrency
       */
      const stockUpdate = await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE id = $2 AND stock_quantity >= $1
         RETURNING stock_quantity`,
        [item.quantity, item.product_id]
      );

      if (stockUpdate.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product_name}. Please update your cart and try again.`,
        });
      }
    }

    /**
     * Cart Clearing After Successful Order
     * Removes all items from user's cart since they're now part of an order
     */
    await client.query(
      `DELETE FROM cart_items 
       WHERE cart_id IN (
         SELECT id FROM carts WHERE user_id = $1
       )`,
      [userId]
    );

    /**
     * Transaction Commit
     * Confirms all changes to the database
     */
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          id: order.id,
          total_amount: parseFloat(order.total_amount),
          status: order.status,
          created_at: order.created_at
        }
      }
    });
  } catch (error) {
    /**
     * Error Handling and Transaction Rollback
     * Ensures database consistency by rolling back failed order creation
     */
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating order'
    });
  } finally {
    /**
     * Connection Cleanup
     * Returns database connection to the pool
     */
    client.release();
  }
};

/**
 * Get User Orders History Controller
 * 
 * Retrieves a paginated list of all orders for the authenticated user.
 * This endpoint provides order history functionality for user account pages
 * and order tracking interfaces.
 * 
 * @param {Object} req - Express request object with pagination parameters
 * @param {Object} res - Express response object for sending order history
 * 
 * Query Parameters:
 * - page: Page number for pagination (default: 1)
 * - limit: Number of orders per page (default: 10)
 * 
 * Order Information Provided:
 * - Complete order details including ID, total, status, and timestamps
 * - Shipping address information for each order
 * - Orders sorted by creation date (newest first)
 * - Pagination metadata for navigation
 * 
 * Pagination Features:
 * - Configurable page size with sensible defaults
 * - Total count calculation for complete pagination info
 * - Navigation flags for UI components (hasNextPage, hasPrevPage)
 * 
 * Role: Provides order history browsing with pagination for user accounts
 */
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    /**
     * Paginated Orders Query
     * Retrieves user's orders with pagination and descending chronological order
     */
    const ordersQuery = `
      SELECT id, total_amount, status, shipping_address, created_at, updated_at
      FROM orders 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const ordersResult = await pool.query(ordersQuery, [userId, parseInt(limit), offset]);

    /**
     * Total Orders Count for Pagination
     * Calculates pagination metadata by counting total user orders
     */
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE user_id = $1',
      [userId]
    );

    const totalOrders = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalOrders / limit);

    /**
     * Formatted Response with Pagination Metadata
     * Returns orders with proper number formatting and complete pagination info
     */
    res.json({
      success: true,
      data: {
        orders: ordersResult.rows.map(order => ({
          ...order,
          total_amount: parseFloat(order.total_amount)
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders'
    });
  }
};

/**
 * Get Detailed Order Information Controller
 * 
 * Retrieves comprehensive details for a specific order including all order items
 * and associated product information. This endpoint provides complete order
 * information for order detail pages and tracking functionality.
 * 
 * @param {Object} req - Express request object with order ID parameter
 * @param {Object} res - Express response object for sending detailed order data
 * 
 * URL Parameters:
 * - order_id: Unique identifier of the order to retrieve
 * 
 * Detailed Information Provided:
 * - Complete order header information (ID, total, status, shipping, dates)
 * - Individual order items with quantities, prices, and totals
 * - Associated product details for each order item (name, description, image)
 * - Handles cases where products may have been deleted after order creation
 * 
 * Security Features:
 * - Order ownership validation (user can only access their own orders)
 * - Proper error handling for non-existent orders
 * 
 * Data Handling:
 * - LEFT JOIN preserves order items even if products are deleted
 * - Proper null handling for deleted products
 * - Formatted numeric values for consistent display
 * 
 * Role: Provides complete order details for tracking and customer service purposes
 */
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id } = req.params;

    /**
     * Order Header Information Retrieval
     * Gets main order details with ownership validation
     */
    const orderResult = await pool.query(
      `SELECT id, total_amount, status, shipping_address, created_at, updated_at
       FROM orders 
       WHERE id = $1 AND user_id = $2`,
      [order_id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    /**
     * Order Items Detailed Query
     * Retrieves all items in the order with complete product information
     */
    const itemsQuery = `
      SELECT 
        oi.quantity,
        oi.price,
        oi.created_at,
        p.id as product_id,
        p.name as product_name,
        p.description,
        p.image_url,
        p.category,
        (oi.quantity * oi.price) as item_total
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `;

    const itemsResult = await pool.query(itemsQuery, [order_id]);

    /**
     * Complete Order Data Assembly
     * Combines order header with detailed items and handles deleted products
     */
    const orderData = {
      ...order,
      total_amount: parseFloat(order.total_amount),
      items: itemsResult.rows.map(item => ({
        quantity: item.quantity,
        price: parseFloat(item.price),
        item_total: parseFloat(item.item_total),
        product: item.product_id ? {
          id: item.product_id,
          name: item.product_name,
          description: item.description,
          image_url: item.image_url,
          category: item.category
        } : null // Handle case where product might be deleted
      }))
    };

    res.json({
      success: true,
      data: {
        order: orderData
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order details'
    });
  }
};

/**
 * Get Order Statistics Controller
 * 
 * Provides comprehensive statistics about a user's order history including
 * total spending, order counts by status, and other metrics useful for
 * dashboard displays and customer insights.
 * 
 * @param {Object} req - Express request object with authenticated user data
 * @param {Object} res - Express response object for sending order statistics
 * 
 * Statistics Provided:
 * - Total number of orders placed by the user
 * - Total amount spent across all orders
 * - Order counts broken down by status (pending, processing, shipped, etc.)
 * - Useful for user dashboards and account overview pages
 * 
 * Database Query Features:
 * - Single efficient query using conditional COUNT aggregation
 * - COALESCE handles users with no orders (returns 0 instead of null)
 * - Comprehensive status breakdown for order tracking visualization
 * 
 * Use Cases:
 * - User dashboard statistics display
 * - Order history overview
 * - Customer service insights
 * - Business analytics and reporting
 * 
 * Role: Provides aggregated order analytics for user account management and insights
 */
const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    /**
     * Comprehensive Order Statistics Query
     * Single query that calculates all order statistics using conditional aggregation
     */
    const statsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_spent,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders 
      WHERE user_id = $1
    `;

    const result = await pool.query(statsQuery, [userId]);
    const stats = result.rows[0];

    /**
     * Formatted Statistics Response
     * Returns properly typed and formatted statistics for frontend consumption
     */
    res.json({
      success: true,
      data: {
        stats: {
          total_orders: parseInt(stats.total_orders),
          total_spent: parseFloat(stats.total_spent),
          pending_orders: parseInt(stats.pending_orders),
          processing_orders: parseInt(stats.processing_orders),
          shipped_orders: parseInt(stats.shipped_orders),
          delivered_orders: parseInt(stats.delivered_orders),
          cancelled_orders: parseInt(stats.cancelled_orders)
        }
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order statistics'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderStats
};