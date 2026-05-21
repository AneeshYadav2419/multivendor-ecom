import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "./auth.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validateMiddleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// Security Rate Limiters
// ─────────────────────────────────────────────────────────
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 authentication attempts per window
  message: "Too many authentication attempts from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────
// Authentication Routes
// ─────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer or vendor
 * @access  Public
 */
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate credentials and open session
 * @access  Public
 */
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Rotate active session access & refresh tokens
 * @access  Public
 */
router.post(
  "/refresh",
  authRateLimiter,
  authController.refresh
);

/**
 * @route   POST /api/auth/logout
 * @desc    Terminate active device session
 * @access  Public
 */
router.post(
  "/logout",
  authController.logout
);

/**
 * @route   POST /api/auth/logout-all
 * @desc    Terminate all active sessions (force absolute logout)
 * @access  Private (Authenticated User)
 */
router.post(
  "/logout-all",
  protect,
  authController.logoutAll
);

/**
 * @route   GET /api/auth/me
 * @desc    Fetch authenticated user profile details
 * @access  Private (Authenticated User)
 */
router.get(
  "/me",
  protect,
  authController.getMe
);

export default router;
