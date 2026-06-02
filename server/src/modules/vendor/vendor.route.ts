import { Router } from "express";
import {
    getMyProfile,
    updateMyProfile,
    getVendorsByStatus,
    updateVendorStatus,
    getAllVendors,
    getDashboard
} from "./vendor.controller.js";

import { protect, restrictTo } from "../../common/middlewares/authMiddleware.js";
import { validate } from "../../common/middlewares/validateMiddleware.js";
import {
    updateVendorProfileSchema,
    updateVendorStatusSchema,
} from "./vendor.validation.js";

const router = Router();


router.get(
    "/dashboard",
    protect,
    restrictTo("VENDOR"),
    getDashboard
);



// ─────────────────────────────────────────────────────────
// Vendor Routes (Self-management)
// ─────────────────────────────────────────────────────────

/**
 * @route   GET /api/vendors/me
 * @desc    Get current vendor's profile
 * @access  Private (Vendor)
 */
router.get(
    "/me",
    protect,
    restrictTo("VENDOR"),
    getMyProfile
);

/**
 * @route   PATCH /api/vendors/me
 * @desc    Update current vendor's store details
 * @access  Private (Vendor)
 */
router.patch(
    "/me",
    protect,
    restrictTo("VENDOR"),
    validate(updateVendorProfileSchema),
    updateMyProfile
);

// ─────────────────────────────────────────────────────────
// Admin Routes (Vendor Management)
// ─────────────────────────────────────────────────────────

/**
 * @route   GET /api/vendors
 * @desc    Get all vendors (can filter by status in query)
 * @access  Private (Admin)
 */
router.get(
    "/",
    protect,
    restrictTo("ADMIN"),
    getVendorsByStatus
);

/**
 * @route   PATCH /api/vendors/:vendorId/status
 * @desc    Approve, Reject, or Suspend a vendor
 * @access  Private (Admin)
 */
router.patch(
    "/:vendorId/status",
    protect,
    restrictTo("ADMIN"),
    validate(updateVendorStatusSchema),
    updateVendorStatus
);

export default router