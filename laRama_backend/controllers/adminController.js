/**
 * @fileoverview Administrative Authentication Controller for LaRama Platform
 *
 * Provides a minimal authentication skeleton for the LaRama administrative panel.
 * The implementation uses a temporary hardcoded administrator account that can be
 * replaced with real database-backed credentials in future iterations. JWT tokens
 * are issued for session management and verified through dedicated middleware.
 *
 * Administrative Authentication Features:
 * - Hardcoded administrator credentials for initial access
 * - JWT token generation scoped for administrative operations
 * - Token verification endpoint for maintaining session state
 * - Extensible structure prepared for future database integration
 *
 * Future Enhancements:
 * - Replace hardcoded credentials with database-stored admin accounts
 * - Implement role-based access controls for granular permissions
 * - Integrate audit logging for administrative actions
 * - Add password rotation and multi-factor authentication capabilities
 *
 * @author Mohamad Abou Naasse
 * @course University of Balamand - Advances in Computer Science
 * @project LaRama Handcrafted Products E-commerce Platform
 * @business LaRama Handcrafted (Owner: Rama)
 */

const jwt = require('jsonwebtoken'); // JWT library for issuing administrative session tokens

// Temporary administrator credentials (to be replaced with database-backed accounts later)
const TEMP_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@larama.com';
const TEMP_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LaRamaAdmin123!';

// Administrative token configuration leveraging existing JWT infrastructure
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'larama_admin_secret';
const ADMIN_TOKEN_EXPIRY = process.env.ADMIN_JWT_EXPIRE || '8h';

/**
 * Generate Administrative JWT Token
 *
 * Issues a signed JWT token scoped for administrative usage.
 * The token payload contains identifying information that can be
 * leveraged for future role-based enhancements.
 *
 * @param {string} email - Administrator email used for identification
 * @returns {string} - Signed JWT token for administrative sessions
 */
const generateAdminToken = (email) => {
  return jwt.sign(
    {
      role: 'admin',
      email,
    },
    ADMIN_JWT_SECRET,
    {
      expiresIn: ADMIN_TOKEN_EXPIRY,
      audience: 'larama-admin-panel',
      subject: 'larama-admin-session',
    },
  );
};

/**
 * Administrative Login Controller
 *
 * Validates the provided credentials against the temporary administrator
 * account. Successful authentication results in a signed JWT token that is
 * returned to the client for subsequent authenticated requests.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response with authentication result
 */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (normalizedEmail !== TEMP_ADMIN_EMAIL.toLowerCase() || password !== TEMP_ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: 'Invalid administrator credentials.',
    });
  }

  const token = generateAdminToken(normalizedEmail);

  return res.status(200).json({
    success: true,
    message: 'Administrator authenticated successfully.',
    data: {
      token,
      admin: {
        email: normalizedEmail,
        name: 'LaRama Administrator',
        permissions: ['dashboard:read', 'products:read', 'orders:read'],
      },
    },
  });
};

/**
 * Administrative Session Verification Controller
 *
 * Returns the authenticated administrator profile details retrieved from
 * the request context. The request is expected to be validated by the
 * administrative authentication middleware prior to reaching this handler.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Sends JSON response confirming active session
 */
const verifyAdminSession = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Administrator session verified successfully.',
    data: {
      admin: {
        email: req.admin.email,
        name: 'LaRama Administrator',
        role: 'admin',
      },
    },
  });
};

module.exports = {
  loginAdmin,
  verifyAdminSession,
};
