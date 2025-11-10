/**
 * @fileoverview Newsletter Management Routes for LaRama E-commerce Platform
 * 
 * This module defines all newsletter-related API endpoints for managing email
 * subscriptions, unsubscriptions, and newsletter analytics. It provides both
 * public subscription management and protected administrative functionality
 * for comprehensive email marketing operations.
 * 
 * Route Organization:
 * - Public routes: Newsletter subscription and unsubscription (no auth required)
 * - Protected routes: Statistics and subscriber management (authentication required)
 * - Input validation for all subscription-related operations
 * 
 * Newsletter Features:
 * - Email subscription with validation and duplicate prevention
 * - Newsletter unsubscription with status tracking
 * - Administrative statistics and analytics
 * - Active subscriber list management with pagination
 * - Source tracking for subscription analytics
 * 
 * API Endpoints:
 * - POST /api/newsletter/subscribe - Subscribe email to newsletter
 * - POST /api/newsletter/unsubscribe - Unsubscribe email from newsletter
 * - GET /api/newsletter/stats - Get comprehensive newsletter statistics (protected)
 * - GET /api/newsletter/subscribers - Retrieve active subscriber list (protected)
 * 
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const express = require('express');                           // Express framework for routing
const { validateRequest, validationRules } = require('../middleware/validation'); // Input validation middleware
const { optionalAuth, authenticateToken } = require('../middleware/auth'); // Authentication middleware options
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterStats,
  getActiveSubscribers
} = require('../controllers/newsletterController');          // Newsletter management controller functions

const router = express.Router();

/**
 * Public Newsletter Routes
 * These endpoints are accessible without authentication to enable newsletter subscription
 * and unsubscription from various sources including website forms and email links
 */

/**
 * @route POST /api/newsletter/subscribe
 * @description Newsletter Subscription Endpoint
 * 
 * Manages newsletter subscriptions with comprehensive validation, duplicate prevention,
 * and reactivation handling. This endpoint enables users to subscribe to LaRama's
 * newsletter while maintaining data integrity and providing smooth user experience.
 * 
 * Authentication: Not required (public endpoint)
 * 
 * Middleware Stack:
 * 1. validateRequest(validationRules.newsletter) - Validates email format and requirements
 * 2. subscribeNewsletter - Controller function that processes subscription logic
 * 
 * Request Body Requirements:
 * - email: Valid email address for newsletter subscription (required)
 * - source: Optional source tracking for analytics (default: 'website')
 * 
 * Subscription Logic:
 * - Email format validation using regex patterns
 * - Duplicate subscription prevention with user-friendly messaging
 * - Automatic reactivation of previously unsubscribed emails
 * - Source attribution for marketing channel analysis
 * - Case-insensitive email handling for consistency
 * 
 * Business Rules:
 * - Emails are normalized to lowercase for database consistency
 * - Previously unsubscribed users can be seamlessly reactivated
 * - Already active subscriptions return success without duplication
 * - Source tracking enables marketing effectiveness analysis
 * 
 * Use Cases:
 * - Website footer newsletter subscription forms
 * - Homepage newsletter signup widgets
 * - Product page newsletter promotions
 * - Marketing campaign landing page subscriptions
 * - Social media newsletter promotion links
 * 
 * Response Scenarios:
 * - New subscription: 201 status with subscription confirmation
 * - Already subscribed: 200 status with friendly notification
 * - Reactivated subscription: 200 status with welcome back message
 * - Invalid email: 400 status with validation error details
 * 
 * Role: Enables newsletter subscription for customer engagement and marketing communication
 */
router.post('/subscribe', validateRequest(validationRules.newsletter), subscribeNewsletter);

/**
 * @route POST /api/newsletter/unsubscribe
 * @description Newsletter Unsubscription Endpoint
 * 
 * Handles newsletter unsubscription requests with proper validation and compliance
 * features. This endpoint allows users to opt out of newsletter communications
 * while maintaining subscription records for potential reactivation and compliance.
 * 
 * Authentication: Not required (public endpoint for compliance)
 * 
 * Middleware Stack:
 * 1. validateRequest(validationRules.newsletter) - Validates email format
 * 2. unsubscribeNewsletter - Controller function that processes unsubscription
 * 
 * Request Body Requirements:
 * - email: Valid email address to unsubscribe from newsletter (required)
 * 
 * Unsubscription Process:
 * - Email format validation for proper processing
 * - Subscription existence verification in database
 * - Status update to unsubscribed with timestamp recording
 * - Subscription record preservation for compliance and reactivation
 * 
 * Compliance Features:
 * - Immediate unsubscription upon request for legal compliance
 * - Audit trail with unsubscription timestamps
 * - Data retention for regulatory compliance requirements
 * - Graceful handling of already unsubscribed emails
 * 
 * Use Cases:
 * - Email newsletter unsubscribe links
 * - Website unsubscription forms and pages
 * - Customer service unsubscription requests
 * - Compliance-driven opt-out mechanisms
 * 
 * Business Logic:
 * - Soft delete approach (status change vs. record deletion)
 * - Preserved subscription data for potential reactivation
 * - Already unsubscribed emails return success without error
 * - Maintains email marketing compliance standards
 * 
 * Role: Provides compliant newsletter unsubscription with proper audit trails
 */
router.post('/unsubscribe', validateRequest(validationRules.newsletter), unsubscribeNewsletter);

/**
 * Protected Administrative Routes
 * These endpoints require authentication and are intended for administrative
 * and marketing analysis purposes
 */

/**
 * @route GET /api/newsletter/stats
 * @description Newsletter Statistics and Analytics Endpoint
 * 
 * Provides comprehensive analytics and statistics about newsletter subscriptions
 * for administrative dashboards and marketing analysis. This protected endpoint
 * generates detailed metrics about subscription patterns and engagement.
 * 
 * Authentication: Required (JWT token for admin access)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates admin/user authentication
 * 2. getNewsletterStats - Controller function that calculates newsletter statistics
 * 
 * Statistics Provided:
 * - Total subscription count across all time periods
 * - Active subscriptions currently receiving newsletters
 * - Unsubscribed count for churn analysis and trends
 * - New subscriptions in the last 30 days for growth tracking
 * - Source breakdown (website, footer, etc.) for channel analysis
 * 
 * Business Intelligence Features:
 * - Single efficient query using conditional COUNT aggregation
 * - Time-based metrics for growth trend analysis over periods
 * - Source attribution for marketing channel effectiveness measurement
 * - Status breakdown for subscriber engagement analysis
 * 
 * Use Cases:
 * - Marketing dashboard analytics and KPI tracking
 * - Newsletter subscription growth monitoring
 * - Marketing channel performance analysis and optimization
 * - Customer engagement reporting and insights
 * - Business intelligence and strategic planning
 * 
 * Analytics Value:
 * - Subscription growth rate calculation and trending
 * - Channel effectiveness and ROI analysis for marketing
 * - Customer engagement pattern identification
 * - Churn rate analysis and retention strategies
 * 
 * Role: Provides comprehensive newsletter analytics for business intelligence and marketing optimization
 */
router.get('/stats', authenticateToken, getNewsletterStats);

/**
 * @route GET /api/newsletter/subscribers
 * @description Active Newsletter Subscribers List Endpoint
 * 
 * Retrieves a paginated list of all active newsletter subscribers for
 * administrative management and marketing campaign purposes. This protected
 * endpoint provides access to the subscriber base with comprehensive pagination.
 * 
 * Authentication: Required (JWT token for admin access)
 * 
 * Middleware Stack:
 * 1. authenticateToken - Validates admin/user authentication
 * 2. getActiveSubscribers - Controller function that retrieves paginated subscriber list
 * 
 * Query Parameters (all optional):
 * - page: Page number for pagination navigation (integer, default: 1)
 * - limit: Number of subscribers per page (integer, default: 50)
 * 
 * Subscriber Information Provided:
 * - Email addresses of all active subscribers for campaign targeting
 * - Subscription dates for recency analysis and segmentation
 * - Source attribution for each subscription (channel analysis)
 * - Comprehensive pagination metadata for list navigation
 * 
 * Administrative Features:
 * - Only returns active subscribers (filters out unsubscribed)
 * - Chronological ordering (newest subscriptions first) for relevance
 * - Efficient pagination for handling large subscriber databases
 * - Total count calculation for list size management
 * 
 * Use Cases:
 * - Email marketing campaign recipient list generation
 * - Subscriber database management and maintenance
 * - Customer segmentation for targeted marketing campaigns
 * - Export functionality for external marketing tools
 * - Subscriber analytics and demographic analysis
 * 
 * Data Management:
 * - Pagination optimized for large subscriber lists
 * - Efficient database queries with proper indexing
 * - Real-time subscriber count for accurate metrics
 * 
 * Privacy Considerations:
 * - Protected endpoint requiring proper authentication
 * - Access control for subscriber data protection
 * - Audit trail for subscriber data access
 * 
 * Role: Provides administrative access to active subscriber lists for marketing operations and management
 */
router.get('/subscribers', authenticateToken, getActiveSubscribers);

module.exports = router;