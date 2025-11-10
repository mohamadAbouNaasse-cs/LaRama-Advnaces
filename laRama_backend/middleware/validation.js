/**
 * @fileoverview Input Validation Middleware for LaRama E-commerce Platform
 * 
 * This module provides comprehensive input validation middleware that ensures all incoming
 * request data meets specified requirements before processing. It includes flexible
 * validation rules, common patterns, and pre-configured validation sets for different
 * API endpoints throughout the application.
 * 
 * Validation Features:
 * - Flexible rule-based validation system for different data types
 * - Comprehensive string validation (length, patterns, format)
 * - Number validation with min/max constraints
 * - Required field validation with proper error handling
 * - Pre-configured validation rules for common operations
 * - Detailed error messages for debugging and user feedback
 * 
 * Security Benefits:
 * - Input sanitization and format validation
 * - Prevention of malformed data processing
 * - Protection against injection attacks through pattern validation
 * - Standardized validation across all API endpoints
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

/**
 * Request Validation Middleware Factory
 * 
 * Creates a validation middleware function that validates incoming request data
 * against specified validation rules. This factory pattern allows for flexible
 * validation configurations while maintaining consistency across endpoints.
 * 
 * @param {Array} validationRules - Array of validation rule objects defining validation criteria
 * @returns {Function} Express middleware function that performs validation
 * 
 * Validation Rule Structure:
 * - field: The field name in req.body to validate
 * - required: Boolean indicating if field is mandatory
 * - type: Expected data type ('string', 'number', 'boolean')
 * - minLength: Minimum string length (for strings)
 * - maxLength: Maximum string length (for strings)
 * - pattern: Regular expression pattern for format validation
 * - min: Minimum value (for numbers)
 * - max: Maximum value (for numbers)
 * 
 * Validation Process:
 * 1. Iterates through all validation rules for the endpoint
 * 2. Checks required field presence and non-empty values
 * 3. Validates data types match expected types
 * 4. Performs string-specific validations (length, patterns)
 * 5. Performs number-specific validations (range checking)
 * 6. Collects all validation errors for comprehensive feedback
 * 7. Returns 400 error with details or continues processing
 * 
 * Error Response Format:
 * - success: false for failed validation
 * - message: General validation failure message
 * - errors: Array of specific field validation errors
 * 
 * Role: Ensures data integrity and security through comprehensive input validation
 */
const validateRequest = (validationRules) => {
  return (req, res, next) => {
    /**
     * Error Collection Array
     * Accumulates validation errors for comprehensive feedback
     */
    const errors = [];
    
    /**
     * Validation Rule Processing Loop
     * Iterates through all validation rules and checks each field
     */
    for (const rule of validationRules) {
      const { field, required, type, minLength, maxLength, pattern, min, max } = rule;
      const value = req.body[field];
      
      /**
       * Required Field Validation
       * Ensures mandatory fields are present and non-empty
       */
      if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors.push(`${field} is required`);
        continue;
      }
      
      /**
       * Optional Field Skip Logic
       * Skips validation for optional fields that weren't provided
       */
      if (!value && !required) continue;
      
      /**
       * Data Type Validation
       * Ensures field values match expected data types
       */
      if (type && typeof value !== type) {
        errors.push(`${field} must be of type ${type}`);
        continue;
      }
      
      /**
       * String-Specific Validations
       * Performs length and pattern validations for string fields
       */
      if (type === 'string' && value) {
        /**
         * Minimum Length Validation
         * Ensures strings meet minimum length requirements
         */
        if (minLength && value.length < minLength) {
          errors.push(`${field} must be at least ${minLength} characters long`);
        }
        
        /**
         * Maximum Length Validation
         * Ensures strings don't exceed maximum length limits
         */
        if (maxLength && value.length > maxLength) {
          errors.push(`${field} must not exceed ${maxLength} characters`);
        }
        
        /**
         * Pattern Validation
         * Validates string format against regular expressions (emails, UUIDs, etc.)
         */
        if (pattern && !pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
      
      /**
       * Number-Specific Validations
       * Performs range checking for numeric fields
       */
      if (type === 'number' && value !== undefined) {
        /**
         * Minimum Value Validation
         * Ensures numeric values meet minimum requirements
         */
        if (min !== undefined && value < min) {
          errors.push(`${field} must be at least ${min}`);
        }
        
        /**
         * Maximum Value Validation
         * Ensures numeric values don't exceed maximum limits
         */
        if (max !== undefined && value > max) {
          errors.push(`${field} must not exceed ${max}`);
        }
      }
    }
    
    /**
     * Validation Result Processing
     * Returns error response or continues processing based on validation results
     */
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    /**
     * Validation Success
     * Continues to next middleware when all validations pass
     */
    next();
  };
};

/**
 * Common Validation Patterns
 * 
 * Pre-defined regular expression patterns for common data format validation.
 * These patterns ensure consistent validation across the application for
 * frequently used data formats like emails and UUIDs.
 */
const patterns = {
  /**
   * Email Address Pattern
   * Validates email format ensuring proper structure with @ symbol and domain
   * Used for user registration, login, and newsletter subscriptions
   */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  /**
   * UUID Pattern (Version 1-5)
   * Validates UUID format for database identifiers and product IDs
   * Ensures proper UUID structure with correct versioning and variant bits
   */
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

/**
 * Pre-defined Validation Rules Sets
 * 
 * Configuration objects containing validation rules for specific API endpoints.
 * These rule sets ensure consistent validation across the application and
 * provide reusable validation configurations for common operations.
 */
const validationRules = {
  /**
   * User Registration Validation Rules
   * Validates user account creation data including name, email, and password
   * 
   * Validation Requirements:
   * - name: Required string, 2-100 characters for proper identification
   * - email: Required valid email format for communication
   * - password: Required string, 6-50 characters for security balance
   */
  register: [
    { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 100 },
    { field: 'email', required: true, type: 'string', pattern: patterns.email },
    { field: 'password', required: true, type: 'string', minLength: 6, maxLength: 50 }
  ],
  
  /**
   * User Login Validation Rules
   * Validates authentication credentials for user login
   * 
   * Validation Requirements:
   * - email: Required valid email format for user identification
   * - password: Required string for authentication (no length validation on login)
   */
  login: [
    { field: 'email', required: true, type: 'string', pattern: patterns.email },
    { field: 'password', required: true, type: 'string' }
  ],
  
  /**
   * Add to Cart Validation Rules
   * Validates product addition to shopping cart
   * 
   * Validation Requirements:
   * - product_id: Required UUID format for product identification
   * - quantity: Required number, 1-100 items for reasonable cart limits
   */
  addToCart: [
    { field: 'product_id', required: true, type: 'string', pattern: patterns.uuid },
    { field: 'quantity', required: true, type: 'number', min: 1, max: 100 }
  ],
  
  /**
   * Update Cart Item Validation Rules
   * Validates cart item quantity updates
   * 
   * Validation Requirements:
   * - quantity: Required number, 1-100 items for practical cart management
   */
  updateCartItem: [
    { field: 'quantity', required: true, type: 'number', min: 1, max: 100 }
  ],
  
  /**
   * Create Order Validation Rules
   * Validates order creation data including shipping information
   * 
   * Validation Requirements:
   * - shipping_address: Required string, 10-500 characters for complete address
   */
  createOrder: [
    { field: 'shipping_address', required: true, type: 'string', minLength: 10, maxLength: 500 }
  ],
  
  /**
   * Newsletter Subscription Validation Rules
   * Validates newsletter subscription and unsubscription requests
   * 
   * Validation Requirements:
   * - email: Required valid email format for newsletter communications
   */
  newsletter: [
    { field: 'email', required: true, type: 'string', pattern: patterns.email }
  ]
};

module.exports = {
  validateRequest,
  validationRules,
  patterns
};