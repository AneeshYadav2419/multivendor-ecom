import { Router } from "express";
import * as productController from "./product.controller.js";
import { protect, restrictTo, checkVendorApproval } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validateMiddleware.js";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./product.validation.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────────────────

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering & pagination
 * @access  Public
 */
router.get("/", validate(productQuerySchema), productController.getAllProducts);

/**
 * @route   GET /api/products/vendor/me
 * @desc    Get all products for the logged-in vendor
 * @access  Private (Vendor Only + Approved)
 */
router.get(
  "/vendor/me",
  protect,
  restrictTo("VENDOR"),
  checkVendorApproval,
  productController.getMyProducts
);

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
router.get("/:id", productController.getProductById);

// ─────────────────────────────────────────────────────────
// Vendor Routes (Requires Authentication & Approval)
// ─────────────────────────────────────────────────────────

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Vendor Only + Approved)
 */
router.post(
  "/",
  protect,
  restrictTo("VENDOR"),
  checkVendorApproval,
  validate(createProductSchema),
  productController.createProduct
);

/**
 * @route   PATCH /api/products/:id
 * @desc    Update a product (only if owner)
 * @access  Private (Vendor Only + Approved)
 */
router.patch(
  "/:id",
  protect,
  restrictTo("VENDOR"),
  checkVendorApproval,
  validate(updateProductSchema),
  productController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (only if owner)
 * @access  Private (Vendor Only + Approved)
 */
router.delete(
  "/:id",
  protect,
  restrictTo("VENDOR"),
  checkVendorApproval,
  productController.deleteProduct
);

export default router;
