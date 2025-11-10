/**
 * @fileoverview Shopping Cart Routes for LaRama E-commerce Platform
 * 
 * This module defines all shopping cart-related API endpoints for managing user cart
 * operations including viewing cart contents, adding items, updating quantities,
 * removing items, and clearing the cart. All routes require user authentication
 * to ensure cart operations are performed on behalf of authenticated users.
 * 
 * Authentication Requirements:
 * - All cart routes require valid JWT authentication tokens
 * - User authentication middleware applied to entire router
 * - Cart operations are user-specific and secured
 * 
 * Cart Management Features:
 * - Complete cart content retrieval with product details
 * - Secure item addition with stock validation and transaction safety
 * - Quantity updates with inventory checking
 * - Individual item removal and complete cart clearing
 * - Comprehensive validation for all cart operations
 * 
 * API Endpoints:
 * - GET /api/cart - Retrieve user's complete shopping cart
 * - POST /api/cart/add - Add products to shopping cart with validation
 * - PUT /api/cart/items/:cart_item_id - Update cart item quantities
 * - DELETE /api/cart/items/:cart_item_id - Remove individual cart items
 * - DELETE /api/cart/clear - Clear entire shopping cart
 * - DELETE /api/cart - Alternative cart clearing endpoint for frontend compatibility
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
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');               // Shopping cart controller functions

const router = express.Router();

/**
 * Global Authentication Middleware
 * All cart routes require user authentication to ensure cart operations
 * are performed securely on behalf of authenticated users only
 */
router.use(authenticateToken);

/**
 * @route GET /api/cart
 * @description Retrieve User's Shopping Cart
 * 
 * Retrieves the complete shopping cart for the authenticated user including all
 * cart items with detailed product information and calculated totals. This endpoint
 * provides all necessary data for cart display and checkout preparation.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates JWT token and populates req.user
 * 2. getCart - Controller function that retrieves complete cart information
 * 
 * Cart Information Provided:
 * - Complete list of cart items with quantities and addition dates
 * - Full product details for each cart item (name, price, image, description)
 * - Individual item totals (quantity × price) for each product
 * - Overall cart total and item count for checkout display
 * - Stock availability information for each product
 * 
 * Response Data Structure:
 * - cart.items: Array of cart items with embedded product information
 * - cart.total_items: Total number of items in cart for UI indicators
 * - cart.cart_total: Overall cart value for checkout processing
 * 
 * Use Cases:
 * - Shopping cart page display and management
 * - Checkout process initialization and validation
 * - Cart summary widgets and navigation indicators
 * - Mobile cart views and quick cart previews
 * 
 * Role: Provides complete cart state for shopping and checkout functionality
 */
router.get('/', getCart);

/**
 * @route POST /api/cart/add
 * @description Add Product to Shopping Cart
 * 
 * Adds products to the user's shopping cart with comprehensive validation and
 * transaction safety. This endpoint handles both new item additions and quantity
 * updates for existing items while ensuring stock availability.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. validateRequest(validationRules.addToCart) - Validates request data format
 * 3. addToCart - Controller function that processes cart addition logic
 * 
 * Request Body Requirements:
 * - product_id: Unique identifier of the product to add (required)
 * - quantity: Number of items to add (positive integer, required)
 * 
 * Validation and Security:
 * - Product existence and active status verification
 * - Stock availability validation against requested quantity
 * - Cart item ownership verification for user security
 * - Transaction safety with automatic rollback on errors
 * 
 * Cart Logic:
 * - If product already in cart: Updates existing quantity
 * - If new product: Creates new cart item entry
 * - Validates combined quantity against available stock
 * - Prevents overselling through comprehensive stock checking
 * 
 * Use Cases:
 * - Product page "Add to Cart" functionality
 * - Quick add buttons on product listings
 * - Bulk item addition from wish lists
 * - Re-ordering from previous purchases
 * 
 * Role: Securely adds products to cart with comprehensive validation and stock management
 */
router.post('/add', validateRequest(validationRules.addToCart), addToCart);

/**
 * @route PUT /api/cart/items/:cart_item_id
 * @description Update Cart Item Quantity
 * 
 * Modifies the quantity of an existing item in the user's cart with validation
 * to ensure stock availability and cart item ownership. This endpoint allows
 * quantity adjustments without removing and re-adding items.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. validateRequest(validationRules.updateCartItem) - Validates quantity data
 * 3. updateCartItem - Controller function that processes quantity updates
 * 
 * URL Parameters:
 * - cart_item_id: Unique identifier of the cart item to update
 * 
 * Request Body Requirements:
 * - quantity: New quantity for the cart item (positive integer)
 * 
 * Validation Process:
 * - Cart item ownership verification through user's cart
 * - Product active status confirmation
 * - Stock availability validation for new quantity
 * - Database update with proper error handling
 * 
 * Security Features:
 * - Cart item belongs to authenticated user only
 * - Cannot update items from other users' carts
 * - Stock validation prevents overselling
 * - Only allows updates to active products
 * 
 * Use Cases:
 * - Cart page quantity adjustment controls
 * - Mobile cart quantity spinners and inputs
 * - Bulk quantity updates for business orders
 * - Cart optimization and item management
 * 
 * Role: Enables secure quantity adjustments for existing cart items with full validation
 */
router.put('/items/:cart_item_id', validateRequest(validationRules.updateCartItem), updateCartItem);

/**
 * @route DELETE /api/cart/items/:cart_item_id
 * @description Remove Individual Cart Item
 * 
 * Removes a specific item from the user's shopping cart with ownership validation.
 * This endpoint provides secure item removal ensuring users can only remove
 * items from their own carts.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. removeFromCart - Controller function that processes item removal
 * 
 * URL Parameters:
 * - cart_item_id: Unique identifier of the cart item to remove
 * 
 * Security Process:
 * - Verifies cart item belongs to authenticated user through subquery
 * - Deletes the cart item if ownership is confirmed
 * - Returns appropriate error if item not found or unauthorized
 * 
 * Database Operation:
 * - Uses subquery to ensure cart ownership before deletion
 * - Atomic delete operation with built-in ownership verification
 * - Returns deletion confirmation for frontend feedback
 * 
 * Use Cases:
 * - Cart page item removal buttons and controls
 * - "Remove from Cart" functionality on product pages
 * - Cart cleanup and item management
 * - Mobile cart swipe-to-delete interactions
 * 
 * Error Scenarios:
 * - 404 if cart item doesn't exist or doesn't belong to user
 * - 500 for database or system errors during deletion
 * - Success response for successful item removal
 * 
 * Role: Provides secure individual item removal from shopping cart with ownership protection
 */
router.delete('/items/:cart_item_id', removeFromCart);

/**
 * @route DELETE /api/cart/clear
 * @description Clear Entire Shopping Cart (Primary Endpoint)
 * 
 * Removes all items from the user's shopping cart in a single operation.
 * This endpoint is typically used during checkout completion or when users
 * want to start fresh with their cart contents.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. clearCart - Controller function that processes complete cart clearing
 * 
 * Cart Clearing Process:
 * - Removes all cart items belonging to the authenticated user
 * - Uses subquery to ensure only user's cart items are affected
 * - Atomic operation that clears entire cart contents safely
 * 
 * Use Cases:
 * - Post-checkout cart clearing after successful order creation
 * - User-initiated cart reset for fresh start
 * - Administrative cart cleanup operations
 * - Session cleanup during logout processes
 * 
 * Security Features:
 * - User authentication required for cart access
 * - Subquery ensures only user's cart is affected
 * - Cannot clear other users' carts under any circumstances
 * 
 * Role: Provides complete cart clearing functionality for checkout and reset operations
 */
router.delete('/clear', clearCart);

/**
 * @route DELETE /api/cart
 * @description Clear Entire Shopping Cart (Alternative Endpoint)
 * 
 * Alternative endpoint for clearing the entire shopping cart, provided for
 * frontend compatibility and different API design preferences. Functionally
 * identical to the /clear endpoint but follows RESTful resource deletion pattern.
 * 
 * Authentication: Required (JWT token)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates user authentication
 * 2. clearCart - Controller function that processes complete cart clearing (same as /clear)
 * 
 * Frontend Compatibility:
 * - Supports different frontend API design patterns
 * - Allows for RESTful DELETE operation on cart resource
 * - Provides flexibility for different client implementations
 * 
 * Use Cases:
 * - Frontend applications preferring RESTful resource deletion
 * - API clients expecting standard DELETE on resource endpoints
 * - Backward compatibility with existing implementations
 * 
 * Implementation Note:
 * - Uses the same clearCart controller function as /clear endpoint
 * - Maintains identical functionality and security features
 * - Provides API design flexibility without code duplication
 * 
 * Role: Alternative cart clearing endpoint for frontend compatibility and RESTful API design
 */
router.delete('/', clearCart); // Alternative endpoint for frontend compatibility

module.exports = router;