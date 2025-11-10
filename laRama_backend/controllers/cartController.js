/**
 * @fileoverview Shopping Cart Management Controller for LaRama E-commerce Platform
 * 
 * This controller handles all shopping cart operations including viewing cart contents,
 * adding items, updating quantities, removing items, and clearing the cart.
 * It provides comprehensive cart management functionality with stock validation,
 * transaction safety, and detailed cart calculations for the e-commerce experience.
 * 
 * Key Features:
 * - Complete cart content retrieval with product details
 * - Secure item addition with stock validation
 * - Quantity updates with inventory checking
 * - Individual item removal and cart clearing
 * - Transaction safety using database transactions
 * - Comprehensive cart total calculations
 * 
 * Security Features:
 * - User authentication required for all operations
 * - Cart item ownership validation
 * - Stock quantity validation before operations
 * - Database transaction rollback on errors
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const { pool } = require('../config/database'); // PostgreSQL database connection pool

/**
 * Get User's Shopping Cart Controller
 * 
 * Retrieves the complete shopping cart for an authenticated user including all
 * cart items with product details and calculated totals. This endpoint provides
 * all necessary information for displaying cart contents and checkout preparation.
 * 
 * @param {Object} req - Express request object with authenticated user data
 * @param {Object} res - Express response object for sending cart information
 * 
 * Authentication Requirement:
 * - Requires valid JWT token and user authentication
 * - User ID is extracted from req.user populated by auth middleware
 * 
 * Cart Information Provided:
 * - Complete list of cart items with quantities and dates added
 * - Full product details for each cart item (name, price, image, etc.)
 * - Individual item totals and overall cart total
 * - Stock availability information for each product
 * 
 * Database Query Features:
 * - Complex JOIN operation across carts, cart_items, and products tables
 * - LEFT JOIN ensures cart is returned even if empty
 * - Only includes active products to prevent ordering discontinued items
 * - Ordered by addition date (newest first) for user convenience
 * 
 * Calculation Logic:
 * - Calculates individual item totals (quantity × price)
 * - Computes total cart value for checkout display
 * - Counts total items in cart for UI indicators
 * 
 * Role: Provides complete cart state for shopping cart pages and checkout process
 */
const getCart = async (req, res) => {
  try {
    /**
     * User Authentication Extraction
     * Gets the authenticated user ID from the JWT token middleware
     */
    const userId = req.user.id;

    /**
     * Comprehensive Cart Query
     * Retrieves cart with all items and complete product information
     * Uses complex JOINs to combine cart, cart_items, and products data
     */
    const query = `
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        ci.added_at,
        p.id as product_id,
        p.name as product_name,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.stock_quantity,
        (ci.quantity * p.price) as item_total
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.id AND p.is_active = true
      WHERE c.user_id = $1
      ORDER BY ci.added_at DESC
    `;

    const result = await pool.query(query, [userId]);

    /**
     * Cart Data Processing and Calculation Logic
     * Processes raw database results into structured cart information
     * Calculates totals and organizes data for frontend consumption
     */
    let cartItems = [];
    let cartTotal = 0;

    result.rows.forEach(row => {
      if (row.product_id) { // Only include rows with valid products
        /**
         * Individual Cart Item Structure
         * Creates structured cart item with embedded product information
         */
        const item = {
          cart_item_id: row.cart_item_id,
          quantity: row.quantity,
          added_at: row.added_at,
          product: {
            id: row.product_id,
            name: row.product_name,
            description: row.description,
            price: parseFloat(row.price),
            image_url: row.image_url,
            category: row.category,
            stock_quantity: row.stock_quantity
          },
          item_total: parseFloat(row.item_total)
        };
        cartItems.push(item);
        cartTotal += parseFloat(row.item_total);
      }
    });

    /**
     * Structured Cart Response
     * Returns organized cart data with items, counts, and totals
     */
    res.json({
      success: true,
      data: {
        cart: {
          items: cartItems,
          total_items: cartItems.length,
          cart_total: cartTotal.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart'
    });
  }
};

/**
 * Add Item to Cart Controller
 * 
 * Adds products to the user's shopping cart with comprehensive validation and
 * transaction safety. This function handles both new item additions and quantity
 * updates for existing items while ensuring stock availability and data consistency.
 * 
 * @param {Object} req - Express request object with user data and product information
 * @param {Object} res - Express response object for sending operation results
 * 
 * Request Body Requirements:
 * - product_id: Unique identifier of the product to add
 * - quantity: Number of items to add (positive integer)
 * 
 * Validation Process:
 * 1. Validates product existence and active status
 * 2. Checks stock availability against requested quantity
 * 3. Verifies user has a valid shopping cart
 * 4. Checks for existing cart items to prevent duplicates
 * 5. Validates total quantity against stock limits
 * 
 * Transaction Safety:
 * - Uses database transactions to ensure data consistency
 * - Automatic rollback on any validation failure or error
 * - Prevents race conditions during concurrent cart operations
 * 
 * Cart Logic:
 * - If product already in cart: Updates existing quantity
 * - If new product: Creates new cart item entry
 * - Validates combined quantity against available stock
 * 
 * Role: Safely adds products to cart with comprehensive validation and error handling
 */
const addToCart = async (req, res) => {
  /**
   * Database Transaction Setup
   * Establishes dedicated database connection for transaction safety
   */
  const client = await pool.connect();
  
  try {
    /**
     * Transaction Initialization
     * Begins database transaction to ensure atomicity of cart operations
     */
    await client.query('BEGIN');
    
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    /**
     * Product Validation and Information Retrieval
     * Verifies product exists, is active, and gets necessary details for validation
     */
    const productResult = await client.query(
      'SELECT id, name, price, stock_quantity FROM products WHERE id = $1 AND is_active = true',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    const product = productResult.rows[0];

    /**
     * Stock Availability Validation
     * Ensures sufficient inventory exists for the requested quantity
     */
    if (product.stock_quantity < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock_quantity} items available`
      });
    }

    /**
     * User Cart Retrieval
     * Gets the user's cart ID for subsequent cart item operations
     */
    const cartResult = await client.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(500).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cartId = cartResult.rows[0].id;

    /**
     * Existing Cart Item Check
     * Determines if product is already in cart to decide between update or insert
     */
    const existingItem = await client.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, product_id]
    );

    if (existingItem.rows.length > 0) {
      /**
       * Existing Item Quantity Update Logic
       * Updates quantity for products already in the cart
       */
      const newQuantity = existingItem.rows[0].quantity + quantity;
      
      /**
       * Combined Quantity Validation
       * Ensures total quantity (existing + new) doesn't exceed stock
       */
      if (newQuantity > product.stock_quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Only ${product.stock_quantity - existingItem.rows[0].quantity} more can be added`
        });
      }

      await client.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      /**
       * New Cart Item Creation
       * Adds completely new product to the user's cart
       */
      await client.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
        [cartId, product_id, quantity]
      );
    }

    /**
     * Transaction Commit
     * Confirms all changes to the database
     */
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    /**
     * Error Handling and Transaction Rollback
     * Ensures database consistency by rolling back failed operations
     */
    await client.query('ROLLBACK');
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding item to cart'
    });
  } finally {
    /**
     * Connection Cleanup
     * Returns database connection to the pool regardless of success or failure
     */
    client.release();
  }
};

/**
 * Update Cart Item Quantity Controller
 * 
 * Modifies the quantity of an existing item in the user's cart with validation
 * to ensure stock availability and cart item ownership. This function allows
 * users to adjust quantities without removing and re-adding items.
 * 
 * @param {Object} req - Express request object with cart item ID and new quantity
 * @param {Object} res - Express response object for sending update results
 * 
 * URL Parameters:
 * - cart_item_id: Unique identifier of the cart item to update
 * 
 * Request Body Requirements:
 * - quantity: New quantity for the cart item (positive integer)
 * 
 * Validation Process:
 * 1. Verifies cart item belongs to the authenticated user
 * 2. Ensures the associated product is still active
 * 3. Validates new quantity against available stock
 * 4. Updates the cart item quantity in the database
 * 
 * Security Features:
 * - Cart item ownership verification through JOIN with user's cart
 * - Only allows updates to active products
 * - Stock validation prevents overselling
 * 
 * Role: Enables quantity adjustments for existing cart items with full validation
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_item_id } = req.params;
    const { quantity } = req.body;

    /**
     * Cart Item Ownership and Validation Query
     * Verifies the cart item belongs to the user and retrieves validation data
     */
    const cartItemResult = await pool.query(
      `SELECT ci.id, ci.product_id, p.stock_quantity, p.name
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE ci.id = $1 AND c.user_id = $2 AND p.is_active = true`,
      [cart_item_id, userId]
    );

    if (cartItemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const cartItem = cartItemResult.rows[0];

    /**
     * Stock Availability Validation
     * Ensures the new quantity doesn't exceed available inventory
     */
    if (quantity > cartItem.stock_quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${cartItem.stock_quantity} items available`
      });
    }

    /**
     * Cart Item Quantity Update
     * Updates the cart item with the new validated quantity
     */
    await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2',
      [quantity, cart_item_id]
    );

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cart item'
    });
  }
};

/**
 * Remove Item from Cart Controller
 * 
 * Removes a specific item from the user's shopping cart with ownership validation.
 * This function provides secure item removal by ensuring users can only remove
 * items from their own carts.
 * 
 * @param {Object} req - Express request object with cart item ID to remove
 * @param {Object} res - Express response object for sending removal results
 * 
 * URL Parameters:
 * - cart_item_id: Unique identifier of the cart item to remove
 * 
 * Security Process:
 * 1. Verifies cart item belongs to authenticated user through subquery
 * 2. Deletes the cart item if ownership is confirmed
 * 3. Returns appropriate error if item not found or doesn't belong to user
 * 
 * Database Operation:
 * - Uses subquery to ensure cart ownership before deletion
 * - Atomic delete operation with ownership verification
 * - Returns rowCount to confirm successful deletion
 * 
 * Role: Provides secure individual item removal from shopping cart
 */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_item_id } = req.params;

    /**
     * Secure Cart Item Deletion with Ownership Verification
     * Deletes cart item only if it belongs to the authenticated user
     */
    const result = await pool.query(
      `DELETE FROM cart_items 
       WHERE id = $1 AND cart_id IN (
         SELECT id FROM carts WHERE user_id = $2
       )`,
      [cart_item_id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing item from cart'
    });
  }
};

/**
 * Clear Entire Cart Controller
 * 
 * Removes all items from the user's shopping cart in a single operation.
 * This function is typically used during checkout completion or when users
 * want to start fresh with their cart contents.
 * 
 * @param {Object} req - Express request object with authenticated user data
 * @param {Object} res - Express response object for sending clear results
 * 
 * Operation Details:
 * - Removes all cart items belonging to the authenticated user
 * - Uses subquery to ensure only user's cart items are affected
 * - Atomic operation that clears entire cart contents
 * 
 * Use Cases:
 * - Post-checkout cart clearing
 * - User-initiated cart reset
 * - Session cleanup operations
 * 
 * Security Features:
 * - User authentication required
 * - Subquery ensures only user's cart is affected
 * - Cannot clear other users' carts
 * 
 * Role: Provides complete cart clearing functionality for checkout and reset operations
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    /**
     * Complete Cart Clearing Operation
     * Removes all cart items for the authenticated user
     */
    await pool.query(
      `DELETE FROM cart_items 
       WHERE cart_id IN (
         SELECT id FROM carts WHERE user_id = $1
       )`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};