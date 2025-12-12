/**
 * @fileoverview Administrative API Routes for LaRama Platform
 *
 * Defines the foundational administrative API endpoints providing authentication
 * capabilities for the LaRama admin panel. Endpoints currently include login
 * and session verification with placeholder data responses, ready to be expanded
 * with full administrative functionality in future iterations.
 */

const express = require('express');
const { loginAdmin, verifyAdminSession } = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/adminAuth');

const router = express.Router();

/**
 * @route POST /api/admin/login
 * @description Authenticates an administrator using temporary credentials and issues a JWT token.
 */
router.post('/login', loginAdmin);

/**
 * @route GET /api/admin/verify
 * @description Verifies administrator session validity using the provided JWT token.
 */
router.get('/verify', authenticateAdmin, verifyAdminSession);

module.exports = router;
