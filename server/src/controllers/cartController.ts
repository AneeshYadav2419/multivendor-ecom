import { Request, Response, NextFunction } from "express";
import * as cartService from "../services/cartService.js";

/**
 * Add item to cart.
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const item = await cartService.addToCartService(req.user!.userId, productId, quantity);

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's cart.
 */
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCartService(req.user!.userId);

    res.status(200).json({
      success: true,
      data: cart || { items: [], totalAmount: 0, itemCount: 0 },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity.
 */
export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = req.params.itemId as string;
    const { quantity } = req.body;
    const item = await cartService.updateCartItemQuantityService(req.user!.userId, itemId, quantity);

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart.
 */
export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = req.params.itemId as string;
    await cartService.removeFromCartService(req.user!.userId, itemId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear the entire cart.
 */
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cartService.clearCartService(req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};