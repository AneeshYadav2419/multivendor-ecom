import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { addToCartSchema, updateCartItemSchema } from "../validations/cartValidation.js";

const router = Router();

// Apply protection to all cart routes
router.use(protect, restrictTo("CUSTOMER"));

/**
 * @route   GET /api/cart
 * @desc    Get current user's cart
 * @access  Private (Customer)
 */
router.get("/", cartController.getCart);

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private (Customer)
 */
router.post("/add", validate(addToCartSchema), cartController.addToCart);

/**
 * @route   PATCH /api/cart/item/:itemId
 * @desc    Update quantity of a cart item
 * @access  Private (Customer)
 */
router.patch("/item/:itemId", validate(updateCartItemSchema), cartController.updateCartItemQuantity);

/**
 * @route   DELETE /api/cart/item/:itemId
 * @desc    Remove a specific item from cart
 * @access  Private (Customer)
 */
router.delete("/item/:itemId", cartController.removeFromCart);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear the entire cart
 * @access  Private (Customer)
 */
router.delete("/clear", cartController.clearCart);

export default router;