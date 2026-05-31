import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { protect, restrictTo } from "../common/middlewares/authMiddleware.js";
import { validate } from "../common/middlewares/validateMiddleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/categoryValidation.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────────────────

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get("/", categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category
 * @access  Public
 */
router.get("/:id", categoryController.getCategoryById);

// ─────────────────────────────────────────────────────────
// Admin Routes (Management)
// ─────────────────────────────────────────────────────────

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (Admin Only)
 */
router.post(
  "/",
  protect,
  restrictTo("ADMIN"),
  validate(createCategorySchema),
  categoryController.createCategory
);

/**
 * @route   PATCH /api/categories/:id
 * @desc    Update a category
 * @access  Private (Admin Only)
 */
router.patch(
  "/:id",
  protect,
  restrictTo("ADMIN"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private (Admin Only)
 */
router.delete(
  "/:id",
  protect,
  restrictTo("ADMIN"),
  categoryController.deleteCategory
);

export default router;
