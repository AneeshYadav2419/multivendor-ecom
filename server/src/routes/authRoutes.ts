import { Router } from "express";
import * as authController from "../controllers/authController.js";
import {
  protect,
  restrictTo,
  checkVendorApproval,
} from "../middlewares/authMiddleware.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// Public Routes (no auth required)
// ─────────────────────────────────────────────────────────
router.post("/register", authController.register);
router.post("/login", authController.login);

// Silently refreshes the access token using the httpOnly refresh cookie.
// No protect middleware here — the refresh token IS the credential.
router.post("/refresh", authController.refresh);

// ─────────────────────────────────────────────────────────
// Protected Routes (valid access token required)
// ─────────────────────────────────────────────────────────
router.get("/me", protect, authController.getMe);

// Logout from current device
router.post("/logout", protect, authController.logout);

// Logout from ALL devices — nuclear option
router.post("/logout-all", protect, authController.logoutAll);

// ─────────────────────────────────────────────────────────
// Role-Specific Routes
// ─────────────────────────────────────────────────────────

// Admin only
router.get("/admin-only", protect, restrictTo("ADMIN"), (req, res) => {
  res.status(200).json({ success: true, message: "Welcome, Admin!" });
});

// Vendor dashboard — must be approved
router.get(
  "/vendor-dashboard",
  protect,
  restrictTo("VENDOR"),
  checkVendorApproval,
  (req, res) => {
    res
      .status(200)
      .json({ success: true, message: "Welcome to your Vendor Dashboard!" });
  }
);

export default router;
