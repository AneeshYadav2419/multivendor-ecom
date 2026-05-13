import { Router } from "express";
import { protect, restrictTo, checkVendorApproval } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Approved Vendor Only)
 * 
 * Middleware Flow:
 * 1. protect: Ensures the user is logged in (JWT valid)
 * 2. restrictTo("VENDOR"): Ensures only users with the VENDOR role can access
 * 3. checkVendorApproval: Ensures the vendor has status "APPROVED" by Admin
 */
router.post(
  "/",
  protect,
  restrictTo("VENDOR"),
  checkVendorApproval,
  (req, res) => {
    res.status(201).json({
      success: true,
      message: "This is a placeholder for adding products. Only approved vendors can see this.",
      vendorId: req.user!.userId
    });
  }
);

/**
 * @route   GET /api/products/my-products
 * @desc    Get products belonging to the current vendor
 * @access  Private (Approved Vendor Only)
 */
router.get(
  "/my-products",
  protect,
  restrictTo("VENDOR"),
  checkVendorApproval,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "List of your products will appear here.",
    });
  }
);

export default router;
