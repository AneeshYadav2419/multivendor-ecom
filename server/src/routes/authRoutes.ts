import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", protect, authController.getMe);

// Admin only route example
router.get(
  "/admin-only",
  protect,
  restrictTo("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome, Admin!",
    });
  }
);

export default router;
