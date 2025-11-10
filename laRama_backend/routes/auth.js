/**
 * @fileoverview Authentication Routes for LaRama E-commerce Platform
 * 
 * This module defines all authentication-related API endpoints including user registration,
 * login, profile management, and token verification. It implements a complete authentication
 * system with proper middleware integration for validation and security.
 * 
 * Route Organization:
 * - Public routes: Registration and login (no authentication required)
 * - Protected routes: Profile access and token verification (authentication required)
 * - Middleware integration: Input validation and JWT authentication
 * 
 * Security Features:
 * - Input validation middleware for all data inputs
 * - JWT token authentication for protected endpoints
 * - Standardized validation rules for consistency
 * - Secure authentication flow with proper error handling
 * 
 * API Endpoints:
 * - POST /api/auth/register - User registration with validation
 * - POST /api/auth/login - User authentication and token generation
 * - GET /api/auth/profile - Retrieve authenticated user profile
 * - GET /api/auth/verify-token - Validate JWT token and return user data
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
  register,
  login,
  getProfile,
  verifyToken
} = require('../controllers/authController');               // Authentication controller functions

const router = express.Router();

/**
 * Public Authentication Routes
 * These endpoints are accessible without authentication and handle initial user interactions
 */

/**
 * @route POST /api/auth/register
 * @description User Registration Endpoint
 * 
 * Handles new user account creation with comprehensive validation and security measures.
 * This endpoint creates user accounts, initializes shopping carts, and provides immediate
 * authentication tokens for seamless user experience.
 * 
 * Middleware Stack:
 * 1. validateRequest(validationRules.register) - Validates registration data format and requirements
 * 2. register - Controller function that processes registration logic
 * 
 * Request Requirements:
 * - name: User's full name (string, required, trimmed)
 * - email: Valid email address (string, required, unique, normalized)
 * - password: Secure password (string, required, minimum length requirements)
 * 
 * Security Features:
 * - Email uniqueness validation to prevent duplicate accounts
 * - Password hashing using bcrypt with high salt rounds
 * - Automatic shopping cart creation for new users
 * - JWT token generation for immediate authentication
 * 
 * Response Data:
 * - User profile information (excluding sensitive data)
 * - JWT authentication token for API access
 * - Success confirmation and user account details
 * 
 * Role: Enables secure user account creation with immediate shopping capabilities
 */
router.post('/register', validateRequest(validationRules.register), register);

/**
 * @route POST /api/auth/login
 * @description User Authentication Endpoint
 * 
 * Authenticates existing users using email and password credentials, providing JWT tokens
 * for accessing protected resources throughout the application.
 * 
 * Middleware Stack:
 * 1. validateRequest(validationRules.login) - Validates login credential format
 * 2. login - Controller function that processes authentication logic
 * 
 * Request Requirements:
 * - email: User's registered email address (string, required)
 * - password: User's account password (string, required)
 * 
 * Authentication Process:
 * - Email normalization and user lookup in database
 * - Secure password verification using bcrypt comparison
 * - JWT token generation upon successful authentication
 * - Generic error messages to prevent user enumeration attacks
 * 
 * Response Data:
 * - User profile information for session establishment
 * - JWT authentication token with configurable expiration
 * - Success confirmation and authentication details
 * 
 * Security Measures:
 * - Secure password comparison preventing timing attacks
 * - Generic error messages for failed authentication attempts
 * - JWT tokens with appropriate expiration for security
 * 
 * Role: Provides secure user authentication with token-based session management
 */
router.post('/login', validateRequest(validationRules.login), login);

/**
 * Protected Authentication Routes
 * These endpoints require valid JWT authentication tokens for access
 */

/**
 * @route GET /api/auth/profile
 * @description User Profile Retrieval Endpoint
 * 
 * Retrieves the current authenticated user's profile information for account management
 * and personalization purposes. Requires valid JWT token authentication.
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates JWT token and populates req.user with user data
 * 2. getProfile - Controller function that returns user profile information
 * 
 * Authentication Requirements:
 * - Valid JWT token in Authorization header (Bearer token format)
 * - Token must not be expired and properly signed
 * - User account must still exist and be active
 * 
 * Response Data:
 * - User ID for frontend state management
 * - User name for personalized interface elements
 * - Email address for account management
 * - Excludes sensitive information (password, tokens, etc.)
 * 
 * Use Cases:
 * - Profile page data loading
 * - User account information display
 * - Personalization and customization features
 * - Account management interfaces
 * 
 * Role: Provides authenticated users with their current profile information
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route GET /api/auth/verify-token
 * @description JWT Token Verification Endpoint
 * 
 * Validates JWT token authenticity and returns user information for session management.
 * Used by frontend applications to verify stored tokens and maintain authentication state.
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates JWT token signature, expiration, and user existence
 * 2. verifyToken - Controller function that confirms token validity
 * 
 * Token Validation Process:
 * - JWT signature verification using secret key
 * - Token expiration timestamp checking
 * - User account existence verification in database
 * - Fresh user data retrieval for session restoration
 * 
 * Response Data:
 * - Token validity confirmation message
 * - Current user profile information
 * - Success status for frontend authentication state
 * 
 * Use Cases:
 * - Application startup token validation
 * - Session restoration after page refresh
 * - Periodic token validity checking in long-running sessions
 * - Authentication state management in single-page applications
 * 
 * Security Features:
 * - Comprehensive token validation including signature and expiration
 * - Real-time user account status verification
 * - Protection against token tampering and replay attacks
 * 
 * Role: Maintains secure authentication state and validates JWT token authenticity
 */
router.get('/verify-token', authenticateToken, verifyToken);

module.exports = router;