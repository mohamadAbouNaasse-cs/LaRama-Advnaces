/**
 * @fileoverview LaRama E-commerce Backend Server
 * 
 * This is the main server file for the LaRama handcrafted products e-commerce platform.
 * It sets up the Express.js server with comprehensive middleware, CORS configuration,
 * routing, error handling, and database connectivity. The server provides a complete
 * RESTful API for managing authentication, products, shopping cart, orders, and newsletter
 * subscriptions for the LaRama business.
 * 
 * Key Features:
 * - RESTful API endpoints for all e-commerce operations
 * - JWT-based authentication system
 * - PostgreSQL database integration with connection testing
 * - CORS configuration for frontend-backend communication
 * - Comprehensive error handling and logging
 * - Health check endpoints for monitoring
 * - Newsletter subscription management
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 * @version 1.0.0
 */

// Load environment variables from .env file for configuration management
require('dotenv').config();

// Import core Express.js framework for creating the web server
const express = require('express');

// Import CORS middleware to handle Cross-Origin Resource Sharing between frontend and backend
const cors = require('cors');

// Import database connection testing utility to verify PostgreSQL connectivity
const { testConnection } = require('./config/database');

/**
 * Route Imports
 * Import all route modules that handle specific business logic areas
 */
const authRoutes = require('./routes/auth');           // User authentication and authorization endpoints
const productRoutes = require('./routes/products');   // Product catalog and management endpoints
const cartRoutes = require('./routes/cart');          // Shopping cart management endpoints
const orderRoutes = require('./routes/orders');       // Order processing and management endpoints
const newsletterRoutes = require('./routes/newsletter'); // Newsletter subscription management endpoints

/**
 * Express Application Instance
 * Creates the main Express application that will handle all HTTP requests
 */
const app = express();

/**
 * Server Port Configuration
 * Uses environment variable PORT if available, otherwise defaults to 5000
 * This allows for flexible deployment across different environments
 */
const PORT = process.env.PORT || 5000;

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * 
 * This middleware function configures CORS to allow the frontend application
 * to communicate with the backend API despite being served from different origins.
 * 
 * Configuration Details:
 * - origin: Specifies which frontend URL can access the API (from environment or localhost:3000)
 * - credentials: Enables sending cookies and authentication headers across origins
 * - methods: Defines allowed HTTP methods for API requests
 * - allowedHeaders: Specifies which headers the client can send in requests
 * 
 * Role: Prevents CORS errors and enables secure frontend-backend communication
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * JSON Body Parser Middleware
 * 
 * This middleware parses incoming requests with JSON payloads and makes the
 * parsed data available in req.body. The 10mb limit prevents potential
 * abuse from extremely large requests.
 * 
 * Role: Enables the server to understand and process JSON data from frontend requests
 */
app.use(express.json({ limit: '10mb' }));

/**
 * URL-Encoded Body Parser Middleware
 * 
 * This middleware parses incoming requests with URL-encoded payloads (form data).
 * The extended: true option allows for rich objects and arrays to be encoded.
 * 
 * Role: Enables processing of form submissions and URL-encoded data
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging Middleware
 * 
 * This custom middleware function logs every incoming HTTP request with timestamp,
 * method, and path information. It's crucial for debugging, monitoring, and
 * understanding API usage patterns.
 * 
 * Function Details:
 * - Captures current timestamp in ISO format for precise logging
 * - Logs HTTP method (GET, POST, PUT, DELETE) and requested path
 * - Calls next() to continue to the next middleware in the chain
 * 
 * Role: Provides visibility into all API requests for debugging and monitoring
 */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Health Check Endpoint
 * 
 * This endpoint provides a comprehensive health check and API documentation.
 * It's the entry point that clients can use to verify the server is running
 * and discover available endpoints.
 * 
 * Response Details:
 * - success: Boolean indicating server operational status
 * - message: Human-readable status message
 * - version: API version for client compatibility checking
 * - timestamp: Current server time for synchronization
 * - endpoints: Complete mapping of available API routes
 * 
 * Role: Serves as API documentation and health monitoring endpoint
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LaRama Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      newsletter: '/api/newsletter'
    }
  });
});

/**
 * API Route Mounting
 * 
 * These middleware functions mount the imported route modules at specific base paths.
 * Each route module handles a specific business domain of the e-commerce platform.
 * 
 * Route Organization:
 * - /api/auth: User authentication, registration, login, profile management
 * - /api/products: Product catalog, categories, search, featured items
 * - /api/cart: Shopping cart operations, add/update/remove items
 * - /api/orders: Order creation, history, status tracking
 * - /api/newsletter: Email subscription management and statistics
 * 
 * Role: Organizes API endpoints by business domain for maintainable architecture
 */
app.use('/api/auth', authRoutes);        // Mount authentication routes
app.use('/api/products', productRoutes); // Mount product management routes
app.use('/api/cart', cartRoutes);        // Mount shopping cart routes
app.use('/api/orders', orderRoutes);     // Mount order processing routes
app.use('/api/newsletter', newsletterRoutes); // Mount newsletter routes

/**
 * 404 Not Found Handler
 * 
 * This middleware catches any requests to endpoints that don't exist.
 * It provides a standardized error response format for undefined routes.
 * 
 * Response Details:
 * - success: false to indicate failure
 * - message: Clear explanation of the error
 * - requested_path: Echo back the invalid path for debugging
 * 
 * Role: Provides consistent error responses for invalid API endpoints
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requested_path: req.originalUrl
  });
});

/**
 * Global Error Handler
 * 
 * This is the final error-catching middleware that handles any unhandled errors
 * throughout the application. It provides standardized error responses and
 * controls what error information is exposed based on environment.
 * 
 * Error Handling Process:
 * - Logs the complete error details to the server console
 * - Returns appropriate HTTP status code (from error or defaults to 500)
 * - Provides clean error message to the client
 * - In development mode, includes stack trace for debugging
 * - In production mode, hides internal error details for security
 * 
 * Role: Ensures all errors are handled gracefully and consistently
 */
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * Server Startup Function
 * 
 * This asynchronous function handles the complete server initialization process.
 * It ensures the database connection is established before starting the HTTP server,
 * providing comprehensive startup logging and error handling.
 * 
 * Startup Process:
 * 1. Tests database connectivity using testConnection()
 * 2. Starts the Express server on the specified port
 * 3. Displays detailed server information and available endpoints
 * 4. Handles startup errors gracefully with appropriate exit codes
 * 
 * Error Handling:
 * - If database connection fails, logs error and exits with code 1
 * - If server startup fails, provides clear error message
 * - Ensures clean shutdown on startup failures
 * 
 * Logging Details:
 * - Server status and configuration information
 * - Complete list of available API endpoints with HTTP methods
 * - Environment and database connection details
 * - Visual indicators for easy monitoring
 * 
 * Role: Orchestrates complete server initialization with proper error handling
 */
const startServer = async () => {
  try {
    /**
     * Database Connection Test
     * Verifies PostgreSQL database connectivity before starting the server.
     * This prevents the server from starting with a broken database connection.
     */
    await testConnection();
    
    /**
     * HTTP Server Startup
     * Starts the Express server and binds it to the specified port.
     * The callback function executes once the server successfully starts.
     */
    app.listen(PORT, () => {
      // Server startup success logging with comprehensive information
      console.log('\n🚀 LaRama Backend Server Started Successfully!');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: ${process.env.DB_NAME}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}`);
      console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      
      // Complete API endpoint documentation for developers
      console.log('\n📋 Available Endpoints:');
      console.log('   GET  / - Health check and API documentation');
      console.log('   POST /api/auth/register - User registration with validation');
      console.log('   POST /api/auth/login - User authentication and JWT token generation');
      console.log('   GET  /api/auth/profile - Retrieve authenticated user profile');
      console.log('   GET  /api/products - Retrieve all products with filtering options');
      console.log('   GET  /api/products/categories - Get available product categories');
      console.log('   GET  /api/products/featured - Retrieve featured/highlighted products');
      console.log('   GET  /api/products/:id - Get detailed product information by ID');
      console.log('   GET  /api/cart - Retrieve user\'s current shopping cart');
      console.log('   POST /api/cart/add - Add product items to shopping cart');
      console.log('   PUT  /api/cart/items/:id - Update quantity of cart items');
      console.log('   DEL  /api/cart/items/:id - Remove items from shopping cart');
      console.log('   POST /api/orders - Create new order from cart items');
      console.log('   GET  /api/orders - Retrieve user\'s order history');
      console.log('   GET  /api/orders/:id - Get detailed order information');
      console.log('   POST /api/newsletter/subscribe - Add email to newsletter list');
      console.log('   POST /api/newsletter/unsubscribe - Remove email from newsletter');
      console.log('   GET  /api/newsletter/stats - Get newsletter subscription statistics');
      console.log('\n✨ Ready to receive requests!');
    });
  } catch (error) {
    /**
     * Startup Error Handler
     * Handles any errors that occur during server initialization.
     * Logs the error message and exits the process with error code 1.
     */
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

/**
 * Server Initialization Call
 * Starts the server startup process by calling the startServer function.
 * This is the entry point that begins the entire application lifecycle.
 */
startServer();