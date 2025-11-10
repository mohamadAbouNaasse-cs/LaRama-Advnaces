/**
 * @fileoverview Database Configuration and Connection Management for LaRama E-commerce Platform
 * 
 * This module manages PostgreSQL database connections using connection pooling for optimal
 * performance and resource management. It provides database connectivity testing, graceful
 * shutdown handling, and comprehensive connection management for the entire application.
 * 
 * Database Features:
 * - PostgreSQL connection pooling for efficient resource utilization
 * - Environment-based configuration for flexible deployment
 * - Connection testing and validation functionality
 * - Graceful shutdown handling for clean application termination
 * - Optimized pool settings for production performance
 * 
 * Connection Pool Benefits:
 * - Reusable database connections for better performance
 * - Automatic connection lifecycle management
 * - Protection against connection leaks and resource exhaustion
 * - Configurable pool size and timeout settings
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const { Pool } = require('pg');    // PostgreSQL client for Node.js
require('dotenv').config();       // Environment variable loading

/**
 * PostgreSQL Connection Pool Configuration
 * 
 * Creates a connection pool for efficient database connection management.
 * The pool maintains multiple reusable connections to handle concurrent
 * database operations while preventing connection exhaustion.
 * 
 * Configuration Parameters:
 * - host: Database server hostname (default: localhost)
 * - port: Database server port (default: 5432 for PostgreSQL)
 * - database: Target database name (LaRama_db_advances)
 * - user: Database username for authentication
 * - password: Database password from environment variables
 * 
 * Pool Management Settings:
 * - max: Maximum number of concurrent connections (20 for high performance)
 * - idleTimeoutMillis: Close idle connections after 30 seconds to free resources
 * - connectionTimeoutMillis: Timeout for establishing new connections (2 seconds)
 * 
 * Environment Variable Integration:
 * - Supports flexible deployment configuration through .env files
 * - Provides sensible defaults for development environments
 * - Enables production configuration through environment variables
 * 
 * Role: Provides reliable and efficient database connectivity for all application operations
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'LaRama_db_advances',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

/**
 * Database Connection Testing Function
 * 
 * Verifies database connectivity and validates configuration settings before
 * application startup. This function ensures the database is accessible and
 * properly configured, preventing runtime failures due to connection issues.
 * 
 * @returns {Promise<void>} Resolves on successful connection, exits process on failure
 * 
 * Connection Validation Process:
 * 1. Attempts to acquire a connection from the pool
 * 2. Validates the connection is functional and responsive
 * 3. Releases the connection back to the pool for reuse
 * 4. Logs success confirmation for operational visibility
 * 5. Exits application with error code on connection failure
 * 
 * Error Handling:
 * - Logs detailed error messages for debugging
 * - Exits process with error code 1 to indicate startup failure
 * - Prevents application startup with broken database configuration
 * 
 * Operational Benefits:
 * - Early detection of database connectivity issues
 * - Prevents application startup with broken database configuration
 * - Provides clear feedback on database connection status
 * - Enables quick diagnosis of configuration problems
 * 
 * Use Cases:
 * - Application startup validation and health checking
 * - Deployment verification and configuration testing
 * - Development environment setup validation
 * - Production readiness verification
 * 
 * Role: Ensures database connectivity before application startup and prevents runtime failures
 */
const testConnection = async () => {
  try {
    /**
     * Connection Acquisition and Testing
     * Attempts to get a working connection from the pool for validation
     */
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    /**
     * Connection Release
     * Returns the test connection to the pool for reuse
     */
    client.release();
  } catch (err) {
    /**
     * Connection Failure Handling
     * Logs error details and exits application to prevent broken startup
     */
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  }
};

/**
 * Graceful Shutdown Handler
 * 
 * Manages clean application termination by properly closing database connections
 * and cleaning up resources. This handler responds to SIGINT signals (Ctrl+C)
 * to ensure graceful shutdown without data loss or connection leaks.
 * 
 * Shutdown Process:
 * 1. Intercepts SIGINT termination signal (Ctrl+C, process manager stop)
 * 2. Logs graceful shutdown initiation for operational awareness
 * 3. Closes all connections in the database pool
 * 4. Waits for connection cleanup completion
 * 5. Exits application cleanly with success code
 * 
 * Resource Cleanup:
 * - Properly closes all active and idle database connections
 * - Prevents connection leaks and resource exhaustion
 * - Ensures database server doesn't hold abandoned connections
 * - Maintains database server performance and stability
 * 
 * Operational Benefits:
 * - Prevents database connection leaks during application restarts
 * - Enables clean deployment and maintenance procedures
 * - Maintains database server health and performance
 * - Provides clear shutdown status for monitoring systems
 * 
 * Use Cases:
 * - Application restarts and deployments
 * - Maintenance window shutdowns
 * - Container orchestration (Docker, Kubernetes) lifecycle management
 * - Development environment cleanup
 * 
 * Role: Ensures clean resource cleanup and prevents database connection leaks during shutdown
 */
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down gracefully...');
  pool.end(() => {
    console.log('📦 Database connection pool closed');
    process.exit(0);
  });
});

module.exports = { pool, testConnection };