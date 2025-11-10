/**
 * @fileoverview Authentication Middleware for LaRama E-commerce Platform
 * 
 * This module provides JWT-based authentication middleware functions that secure
 * API endpoints and manage user authentication state throughout the application.
 * It includes both required and optional authentication mechanisms for different
 * types of endpoints and use cases.
 * 
 * Authentication Features:
 * - JWT token validation with signature verification
 * - Token expiration checking and handling
 * - Real-time user existence validation in database
 * - Comprehensive error handling for various authentication failure scenarios
 * - Optional authentication for public endpoints with user-specific features
 * 
 * Security Measures:
 * - Bearer token format validation and parsing
 * - JWT signature verification using secret key
 * - User account verification to prevent deleted account access
 * - Detailed error messages for different authentication failures
 * - Protection against token tampering and manipulation
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const jwt = require('jsonwebtoken');    // JSON Web Token library for token verification
const { pool } = require('../config/database'); // PostgreSQL database connection pool

/**
 * JWT Authentication Middleware (Required Authentication)
 * 
 * This middleware function enforces authentication for protected routes by validating
 * JWT tokens and ensuring the user exists in the database. It populates req.user
 * with authenticated user information for use in subsequent middleware and controllers.
 * 
 * @param {Object} req - Express request object containing authorization headers
 * @param {Object} res - Express response object for sending authentication errors
 * @param {Function} next - Express next function to continue to next middleware/controller
 * 
 * Authentication Process:
 * 1. Extracts JWT token from Authorization header (Bearer token format)
 * 2. Verifies token signature and expiration using JWT_SECRET
 * 3. Validates that the user still exists in the database
 * 4. Populates req.user with current user information
 * 5. Calls next() to continue processing or returns authentication error
 * 
 * Token Format Expected:
 * - Authorization header: "Bearer <JWT_TOKEN>"
 * - Token must be valid, non-expired, and properly signed
 * 
 * Authentication Validation:
 * - Token presence and format validation
 * - JWT signature verification against secret key
 * - Token expiration timestamp checking
 * - User account existence verification in database
 * - Fresh user data retrieval for session accuracy
 * 
 * Error Scenarios:
 * - 401 Unauthorized: No token provided or user not found
 * - 403 Forbidden: Invalid token signature or expired token
 * - 500 Internal Server Error: Database or system errors
 * 
 * Success Behavior:
 * - Populates req.user with {id, name, email} for controller access
 * - Continues to next middleware/controller in the chain
 * - Enables user-specific operations and data access
 * 
 * Use Cases:
 * - Shopping cart operations requiring user identification
 * - Order management and history access
 * - User profile management and updates
 * - Any endpoint requiring authenticated user context
 * 
 * Role: Enforces authentication requirements and provides user context for protected operations
 */
const authenticateToken = async (req, res, next) => {
  try {
    /**
     * Authorization Header Extraction and Parsing
     * Retrieves the JWT token from the Authorization header in Bearer format
     */
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    /**
     * Token Presence Validation
     * Ensures a token was provided in the request headers
     */
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    /**
     * JWT Token Verification and Decoding
     * Verifies token signature and expiration using the JWT secret key
     * Decodes token payload to extract user information
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    /**
     * User Existence Verification
     * Validates that the user referenced in the token still exists in the database
     * This prevents access with tokens from deleted or disabled accounts
     */
    const userQuery = 'SELECT id, name, email FROM users WHERE id = $1';
    const result = await pool.query(userQuery, [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    /**
     * User Context Population
     * Attaches authenticated user information to the request object
     * for access by subsequent middleware and controllers
     */
    req.user = result.rows[0];
    next();
  } catch (error) {
    /**
     * JWT-Specific Error Handling
     * Provides specific error messages for different JWT validation failures
     */
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    /**
     * General Error Handling
     * Handles database errors and other unexpected authentication failures
     */
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

/**
 * Optional Authentication Middleware (Non-Required Authentication)
 * 
 * This middleware function provides optional authentication for endpoints that can
 * benefit from user context when available but don't require authentication to function.
 * It gracefully handles both authenticated and anonymous requests.
 * 
 * @param {Object} req - Express request object that may contain authorization headers
 * @param {Object} res - Express response object (unused in this optional middleware)
 * @param {Function} next - Express next function to continue processing
 * 
 * Optional Authentication Process:
 * 1. Attempts to extract JWT token from Authorization header
 * 2. If token exists, validates signature and expiration
 * 3. If valid, verifies user exists in database
 * 4. Populates req.user if authentication succeeds
 * 5. Always continues processing regardless of authentication status
 * 
 * Graceful Failure Handling:
 * - Missing token: Continues without user context (req.user remains undefined)
 * - Invalid token: Continues without user context, doesn't throw errors
 * - Expired token: Continues without user context, silently handles expiration
 * - Non-existent user: Continues without user context, handles deleted accounts
 * 
 * Use Cases:
 * - Public product browsing with potential user-specific features
 * - Newsletter subscription from authenticated or anonymous users
 * - Product catalog with possible personalization
 * - Public pages that can show user-specific elements when logged in
 * 
 * Behavioral Patterns:
 * - Never blocks request processing due to authentication failures
 * - Provides user context when valid authentication is available
 * - Enables conditional functionality based on authentication state
 * - Supports both logged-in and guest user experiences
 * 
 * Future Enhancement Possibilities:
 * - User-specific product recommendations when authenticated
 * - Personalized pricing or discounts for authenticated users
 * - User-specific product favorites and wishlists
 * - Recently viewed products tracking
 * 
 * Controller Usage Pattern:
 * ```javascript
 * if (req.user) {
 *   // Provide authenticated user experience
 * } else {
 *   // Provide guest/anonymous user experience
 * }
 * ```
 * 
 * Role: Enables optional user context for enhanced functionality without blocking anonymous access
 */
const optionalAuth = async (req, res, next) => {
  try {
    /**
     * Optional Token Extraction
     * Attempts to retrieve token from Authorization header without requiring it
     */
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    /**
     * Conditional Authentication Processing
     * Only attempts authentication if a token is provided
     */
    if (token) {
      /**
       * Token Validation and User Verification
       * Validates token and populates user context if successful
       */
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userQuery = 'SELECT id, name, email FROM users WHERE id = $1';
      const result = await pool.query(userQuery, [decoded.userId]);
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }
    
    /**
     * Continue Processing
     * Always proceeds to next middleware regardless of authentication outcome
     */
    next();
  } catch (error) {
    /**
     * Silent Error Handling
     * Ignores authentication errors and continues without user context
     * This ensures optional authentication never blocks request processing
     */
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};