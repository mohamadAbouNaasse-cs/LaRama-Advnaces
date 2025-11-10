/**
 * @fileoverview Newsletter Management Controller for LaRama E-commerce Platform
 * 
 * This controller handles all newsletter subscription operations including user subscriptions,
 * unsubscriptions, subscription management, and analytics. It provides comprehensive
 * email list management functionality for marketing and customer engagement purposes.
 * 
 * Key Features:
 * - Email subscription with validation and duplicate prevention
 * - Subscription reactivation for previously unsubscribed users
 * - Newsletter unsubscription with status tracking
 * - Comprehensive subscription analytics and statistics
 * - Active subscriber list management for admin purposes
 * - Source tracking for subscription analytics
 * 
 * Email Management:
 * - Proper email format validation using regex
 * - Case-insensitive email handling for consistency
 * - Status tracking (active, unsubscribed) with timestamps
 * - Source attribution for marketing analytics
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const { pool } = require('../config/database'); // PostgreSQL database connection pool

/**
 * Newsletter Subscription Controller
 * 
 * Manages newsletter subscriptions with comprehensive validation, duplicate prevention,
 * and reactivation handling. This function enables users to subscribe to LaRama's
 * newsletter while maintaining data integrity and providing a smooth user experience.
 * 
 * @param {Object} req - Express request object with subscription data
 * @param {Object} res - Express response object for sending subscription results
 * 
 * Request Body Requirements:
 * - email: Valid email address for newsletter subscription
 * - source: Optional source tracking (default: 'website') for analytics
 * 
 * Subscription Logic:
 * 1. Validates email format using regex pattern
 * 2. Checks for existing subscriptions to prevent duplicates
 * 3. Reactivates previously unsubscribed emails if found
 * 4. Creates new subscription record for new emails
 * 5. Tracks subscription source for marketing analytics
 * 
 * Business Rules:
 * - Emails are normalized to lowercase for consistency
 * - Previously unsubscribed users can be reactivated
 * - Already active subscriptions return success without duplication
 * - Source tracking enables marketing channel analysis
 * 
 * Response Scenarios:
 * - New subscription: 201 status with subscription details
 * - Already subscribed: 200 status with informational message
 * - Reactivated subscription: 200 status with reactivation confirmation
 * - Invalid email: 400 status with validation error
 * - Server error: 500 status with error message
 * 
 * Role: Enables newsletter subscription management for customer engagement and marketing
 */
const subscribeNewsletter = async (req, res) => {
  try {
    const { email, source = 'website' } = req.body;

    /**
     * Email Format Validation
     * Uses regex pattern to ensure email address is properly formatted
     * Prevents invalid email addresses from entering the subscription database
     */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    /**
     * Existing Subscription Check
     * Searches for existing subscriptions to handle duplicates and reactivation
     */
    const existingSubscription = await pool.query(
      'SELECT id, status FROM newsletter_subscriptions WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingSubscription.rows.length > 0) {
      const subscription = existingSubscription.rows[0];
      
      /**
       * Active Subscription Handling
       * Returns success message for already active subscriptions
       */
      if (subscription.status === 'active') {
        return res.status(200).json({
          success: true,
          message: 'Email is already subscribed to our newsletter',
          already_subscribed: true
        });
      } else {
        /**
         * Subscription Reactivation Logic
         * Reactivates previously unsubscribed emails with updated timestamps
         */
        await pool.query(
          'UPDATE newsletter_subscriptions SET status = $1, subscription_date = CURRENT_TIMESTAMP, unsubscribed_date = NULL, source = $2 WHERE email = $3',
          ['active', source, email.toLowerCase()]
        );

        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated',
          reactivated: true
        });
      }
    }

    /**
     * New Subscription Creation
     * Creates a fresh newsletter subscription record for new email addresses
     */
    const result = await pool.query(
      'INSERT INTO newsletter_subscriptions (email, source) VALUES ($1, $2) RETURNING id, email, subscription_date',
      [email.toLowerCase(), source]
    );

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        subscription_id: result.rows[0].id,
        email: result.rows[0].email,
        subscribed_at: result.rows[0].subscription_date
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during newsletter subscription'
    });
  }
};

/**
 * Newsletter Unsubscription Controller
 * 
 * Handles newsletter unsubscription requests with proper validation and status tracking.
 * This function allows users to opt out of newsletter communications while maintaining
 * their subscription record for potential reactivation and compliance purposes.
 * 
 * @param {Object} req - Express request object with unsubscription data
 * @param {Object} res - Express response object for sending unsubscription results
 * 
 * Request Body Requirements:
 * - email: Valid email address to unsubscribe from newsletter
 * 
 * Unsubscription Process:
 * 1. Validates email format to ensure proper email address
 * 2. Checks if email exists in subscription database
 * 3. Verifies current subscription status
 * 4. Updates status to unsubscribed with timestamp
 * 5. Preserves subscription record for reactivation possibility
 * 
 * Business Logic:
 * - Email records are preserved (soft delete) rather than removed
 * - Unsubscribed timestamp is recorded for compliance and analytics
 * - Already unsubscribed emails return success without error
 * - Email normalization ensures consistent processing
 * 
 * Compliance Features:
 * - Immediate unsubscription upon request
 * - Audit trail with unsubscription timestamps
 * - Data retention for compliance purposes
 * 
 * Role: Provides compliant newsletter unsubscription functionality
 */
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    /**
     * Email Format Validation
     * Ensures the provided email address is properly formatted
     */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    /**
     * Subscription Existence Check
     * Verifies the email exists in the subscription database
     */
    const existingSubscription = await pool.query(
      'SELECT id, status FROM newsletter_subscriptions WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingSubscription.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    const subscription = existingSubscription.rows[0];
    
    /**
     * Already Unsubscribed Handling
     * Returns success for emails that are already unsubscribed
     */
    if (subscription.status === 'unsubscribed') {
      return res.status(200).json({
        success: true,
        message: 'Email is already unsubscribed from newsletter',
        already_unsubscribed: true
      });
    }

    /**
     * Subscription Status Update
     * Updates the subscription status to unsubscribed with timestamp
     */
    await pool.query(
      'UPDATE newsletter_subscriptions SET status = $1, unsubscribed_date = CURRENT_TIMESTAMP WHERE email = $2',
      ['unsubscribed', email.toLowerCase()]
    );

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during newsletter unsubscription'
    });
  }
};

/**
 * Newsletter Statistics Controller (Admin Function)
 * 
 * Provides comprehensive analytics and statistics about newsletter subscriptions
 * for administrative and marketing analysis purposes. This function generates
 * detailed metrics about subscription patterns and source attribution.
 * 
 * @param {Object} req - Express request object (no parameters required)
 * @param {Object} res - Express response object for sending statistics data
 * 
 * Statistics Provided:
 * - Total subscription count (all-time)
 * - Active subscriptions currently receiving newsletters
 * - Unsubscribed count for churn analysis
 * - New subscriptions in the last 30 days for growth tracking
 * - Source breakdown (website, footer, etc.) for channel analysis
 * 
 * Business Intelligence Features:
 * - Single efficient query using conditional COUNT aggregation
 * - Time-based metrics for growth trend analysis
 * - Source attribution for marketing channel effectiveness
 * - Status breakdown for engagement analysis
 * 
 * Use Cases:
 * - Marketing dashboard analytics
 * - Subscription growth tracking
 * - Channel performance analysis
 * - Customer engagement reporting
 * 
 * Role: Provides newsletter analytics for business intelligence and marketing optimization
 */
const getNewsletterStats = async (req, res) => {
  try {
    /**
     * Comprehensive Newsletter Analytics Query
     * Single query that calculates all newsletter statistics using conditional aggregation
     */
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed_count,
        COUNT(CASE WHEN subscription_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_this_month,
        COUNT(CASE WHEN source = 'website' THEN 1 END) as from_website,
        COUNT(CASE WHEN source = 'footer' THEN 1 END) as from_footer
      FROM newsletter_subscriptions
    `);

    res.json({
      success: true,
      data: stats.rows[0]
    });

  } catch (error) {
    console.error('Newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching newsletter statistics'
    });
  }
};

/**
 * Active Subscribers List Controller (Admin Function)
 * 
 * Retrieves a paginated list of all active newsletter subscribers for
 * administrative management and marketing campaign purposes. This function
 * provides access to the active subscriber base with pagination support.
 * 
 * @param {Object} req - Express request object with pagination parameters
 * @param {Object} res - Express response object for sending subscriber data
 * 
 * Query Parameters:
 * - page: Page number for pagination (default: 1)
 * - limit: Number of subscribers per page (default: 50)
 * 
 * Subscriber Information Provided:
 * - Email addresses of active subscribers
 * - Subscription dates for recency analysis
 * - Source attribution for each subscription
 * - Pagination metadata for navigation
 * 
 * Administrative Features:
 * - Only returns active subscribers (excludes unsubscribed)
 * - Ordered by subscription date (newest first)
 * - Pagination for handling large subscriber lists
 * - Total count calculation for list management
 * 
 * Use Cases:
 * - Email campaign recipient list generation
 * - Subscriber list management and export
 * - Marketing campaign targeting
 * - Customer communication management
 * 
 * Role: Provides administrative access to active subscriber lists for marketing operations
 */
const getActiveSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    /**
     * Paginated Active Subscribers Query
     * Retrieves active subscribers with pagination and chronological ordering
     */
    const subscribers = await pool.query(
      'SELECT email, subscription_date, source FROM newsletter_subscriptions WHERE status = $1 ORDER BY subscription_date DESC LIMIT $2 OFFSET $3',
      ['active', limit, offset]
    );

    /**
     * Total Active Subscribers Count
     * Calculates pagination metadata by counting total active subscribers
     */
    const totalCount = await pool.query(
      'SELECT COUNT(*) FROM newsletter_subscriptions WHERE status = $1',
      ['active']
    );

    /**
     * Paginated Response with Subscriber Data
     * Returns subscriber list with complete pagination information
     */
    res.json({
      success: true,
      data: {
        subscribers: subscribers.rows,
        total: parseInt(totalCount.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(totalCount.rows[0].count / limit)
      }
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching subscribers'
    });
  }
};

module.exports = {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterStats,
  getActiveSubscribers
};