/**
 * @fileoverview Administrative Authentication Middleware for LaRama Platform
 *
 * Provides request authorization for the administrative API namespace by
 * validating JSON Web Tokens issued specifically for administrator sessions.
 * The middleware ensures that only authenticated administrators can access
 * protected administrative endpoints.
 */

const jwt = require('jsonwebtoken'); // JWT library for verifying administrator tokens

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'larama_admin_secret';

/**
 * Administrative Authentication Middleware
 *
 * Validates the presence of a bearer token and verifies that it is a valid
 * administrative token. Successful validation attaches the administrator
 * payload to the request object for downstream handlers.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 */
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Administrator authentication required.',
    });
  }

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET, {
      audience: 'larama-admin-panel',
      subject: 'larama-admin-session',
    });

    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient privileges for administrative access.',
      });
    }

    req.admin = {
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired administrator session.',
    });
  }
};

module.exports = {
  authenticateAdmin,
};
