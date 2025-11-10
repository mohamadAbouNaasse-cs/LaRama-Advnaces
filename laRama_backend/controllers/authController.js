/**
 * @fileoverview Authentication Controller for LaRama E-commerce Platform
 * 
 * This controller module handles all user authentication operations including
 * user registration, login, profile management, and JWT token operations.
 * It provides secure authentication mechanisms using bcrypt for password hashing
 * and JWT tokens for stateless authentication.
 * 
 * Key Features:
 * - Secure user registration with password hashing
 * - User authentication with JWT token generation
 * - Profile management and token verification
 * - Automatic shopping cart creation for new users
 * - Comprehensive input validation and error handling
 * 
 * Security Measures:
 * - bcrypt password hashing with high salt rounds (12)
 * - JWT tokens with configurable expiration
 * - Email normalization (lowercase, trimmed)
 * - Duplicate user prevention
 * - Secure password comparison
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const bcrypt = require('bcryptjs');    // Password hashing library for secure password storage
const jwt = require('jsonwebtoken');   // JSON Web Token library for stateless authentication
const { pool } = require('../config/database'); // PostgreSQL database connection pool

/**
 * JWT Token Generation Function
 * 
 * Creates a JSON Web Token for user authentication containing the user ID.
 * The token includes an expiration time for security purposes.
 * 
 * @param {string} userId - The unique identifier of the user
 * @returns {string} Signed JWT token for authentication
 * 
 * Function Details:
 * - Embeds userId in the token payload for user identification
 * - Uses JWT_SECRET from environment variables for signing
 * - Sets expiration time (default 24h) for security
 * - Returns signed token ready for client storage and future requests
 * 
 * Role: Provides secure, stateless authentication tokens for API access
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

/**
 * User Registration Controller
 * 
 * Handles new user account creation with comprehensive security measures and
 * automatic shopping cart initialization. This function creates a complete
 * user account ready for e-commerce activities.
 * 
 * @param {Object} req - Express request object containing user registration data
 * @param {Object} res - Express response object for sending registration results
 * 
 * Request Body Requirements:
 * - name: User's full name (will be trimmed)
 * - email: User's email address (will be normalized)
 * - password: Plain text password (will be hashed securely)
 * 
 * Security Process:
 * 1. Validates email uniqueness to prevent duplicate accounts
 * 2. Hashes password using bcrypt with 12 salt rounds for security
 * 3. Normalizes email (lowercase, trimmed) for consistency
 * 4. Creates user record in database with secure password storage
 * 5. Automatically creates shopping cart for new user
 * 6. Generates JWT token for immediate authentication
 * 
 * Database Operations:
 * - Checks for existing user with same email
 * - Inserts new user record with hashed password
 * - Creates associated shopping cart for the user
 * - Returns user data excluding sensitive information
 * 
 * Response Format:
 * - success: Boolean indicating operation success
 * - message: Human-readable success/error message
 * - data: User information and authentication token (on success)
 * 
 * Role: Creates secure user accounts with immediate shopping capabilities
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /**
     * Email Uniqueness Check
     * Prevents duplicate user registration by checking if email already exists
     */
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1', 
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    /**
     * Password Security Hashing
     * Uses bcrypt with 12 salt rounds for strong password protection
     * High salt rounds ensure resistance against rainbow table attacks
     */
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /**
     * User Account Creation
     * Inserts new user with normalized email and secure password hash
     * Returns user data immediately for token generation
     */
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const user = newUser.rows[0];

    /**
     * Shopping Cart Initialization
     * Automatically creates a shopping cart for the new user
     * Ensures user can immediately start shopping after registration
     */
    await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1)',
      [user.id]
    );

    /**
     * Authentication Token Generation
     * Creates JWT token for immediate user authentication
     */
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * User Authentication (Login) Controller
 * 
 * Authenticates existing users by verifying their email and password credentials.
 * Upon successful authentication, provides a JWT token for accessing protected resources.
 * 
 * @param {Object} req - Express request object containing login credentials
 * @param {Object} res - Express response object for sending authentication results
 * 
 * Request Body Requirements:
 * - email: User's registered email address
 * - password: User's plain text password for verification
 * 
 * Authentication Process:
 * 1. Normalizes email input (lowercase, trimmed)
 * 2. Searches database for user with matching email
 * 3. Securely compares provided password with stored hash
 * 4. Generates JWT token upon successful authentication
 * 5. Returns user data and token for client-side storage
 * 
 * Security Features:
 * - Uses bcrypt.compare for secure password verification
 * - Generic error messages to prevent user enumeration attacks
 * - Email normalization for consistent lookup
 * - Excludes sensitive data from response
 * 
 * Response Scenarios:
 * - Success (200): User data and JWT token
 * - Unauthorized (401): Invalid credentials (generic message)
 * - Server Error (500): Database or system errors
 * 
 * Role: Provides secure user authentication with token-based session management
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /**
     * User Lookup by Email
     * Searches for user account using normalized email address
     * Retrieves necessary fields for authentication and response
     */
    const userResult = await pool.query(
      'SELECT id, name, email, password, created_at FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    /**
     * User Existence Validation
     * Returns generic error message to prevent user enumeration
     */
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    /**
     * Secure Password Verification
     * Uses bcrypt to compare provided password with stored hash
     * Protects against timing attacks and hash exposure
     */
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    /**
     * Authentication Success - Token Generation
     * Creates JWT token for authenticated user session
     */
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * User Profile Retrieval Controller
 * 
 * Retrieves the current authenticated user's profile information.
 * This endpoint requires authentication and uses the user data provided
 * by the authentication middleware.
 * 
 * @param {Object} req - Express request object with authenticated user data
 * @param {Object} res - Express response object for sending profile data
 * 
 * Authentication Requirement:
 * - Requires valid JWT token in Authorization header
 * - User data is populated by auth middleware (req.user)
 * - Endpoint is protected and only accessible to authenticated users
 * 
 * Response Data:
 * - Returns clean user profile information
 * - Excludes sensitive data (password, tokens, etc.)
 * - Provides user ID, name, and email for frontend display
 * 
 * Middleware Dependency:
 * - Relies on auth middleware to validate JWT and populate req.user
 * - Auth middleware must run before this controller
 * 
 * Role: Provides authenticated users with their current profile information
 */
const getProfile = async (req, res) => {
  try {
    /**
     * Authenticated User Data Access
     * User information is provided by the authentication middleware
     * which validates the JWT token and populates req.user
     */
    const user = req.user; // From auth middleware

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

/**
 * JWT Token Verification Controller
 * 
 * Verifies the validity of a JWT token and returns user information.
 * This endpoint is used by frontend applications to validate stored
 * tokens and maintain user authentication state.
 * 
 * @param {Object} req - Express request object with authenticated user data
 * @param {Object} res - Express response object for sending verification results
 * 
 * Token Validation Process:
 * 1. Auth middleware validates the JWT token signature
 * 2. Auth middleware checks token expiration
 * 3. Auth middleware retrieves user data from database
 * 4. This controller returns confirmation and user data
 * 
 * Use Cases:
 * - Frontend app startup to check if stored token is still valid
 * - Session restoration after page refresh
 * - Periodic token validation in long-running sessions
 * - User authentication state management
 * 
 * Response Information:
 * - Confirms token validity with success message
 * - Returns current user profile data
 * - Provides fresh user information from database
 * 
 * Role: Validates JWT tokens and maintains user authentication state
 */
const verifyToken = async (req, res) => {
  try {
    /**
     * Authenticated User Verification
     * If this code executes, the token has been successfully validated
     * by the auth middleware, confirming its validity and freshness
     */
    const user = req.user; // From auth middleware

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  verifyToken
};