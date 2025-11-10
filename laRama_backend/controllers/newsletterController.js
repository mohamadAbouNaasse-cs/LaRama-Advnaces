const { pool } = require('../config/database');

/**
 * Newsletter Subscription Controller
 * Handles newsletter subscription, unsubscription, and management
 */

// Subscribe to newsletter
const subscribeNewsletter = async (req, res) => {
  try {
    const { email, source = 'website' } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if email already exists
    const existingSubscription = await pool.query(
      'SELECT id, status FROM newsletter_subscriptions WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingSubscription.rows.length > 0) {
      const subscription = existingSubscription.rows[0];
      
      if (subscription.status === 'active') {
        return res.status(200).json({
          success: true,
          message: 'Email is already subscribed to our newsletter',
          already_subscribed: true
        });
      } else {
        // Reactivate subscription if previously unsubscribed
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

    // Create new subscription
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

// Unsubscribe from newsletter
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if subscription exists
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
    
    if (subscription.status === 'unsubscribed') {
      return res.status(200).json({
        success: true,
        message: 'Email is already unsubscribed from newsletter',
        already_unsubscribed: true
      });
    }

    // Update subscription status to unsubscribed
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

// Get newsletter statistics (admin only)
const getNewsletterStats = async (req, res) => {
  try {
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

// Get all active subscribers (admin only)
const getActiveSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const subscribers = await pool.query(
      'SELECT email, subscription_date, source FROM newsletter_subscriptions WHERE status = $1 ORDER BY subscription_date DESC LIMIT $2 OFFSET $3',
      ['active', limit, offset]
    );

    const totalCount = await pool.query(
      'SELECT COUNT(*) FROM newsletter_subscriptions WHERE status = $1',
      ['active']
    );

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