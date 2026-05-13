import { z } from "zod";

/**
 * Validation for adding an item to the cart.
 */
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string({ message: "Product ID is required" }).cuid("Invalid Product ID"),
    quantity: z
      .number({ message: "Quantity must be a number" })
      .int()
      .min(1, "Quantity must be at least 1")
      .max(50, "Quantity cannot exceed 50 per item"),
  }),
});

/**
 * Validation for updating a cart item's quantity.
 */
export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string({ message: "Item ID is required" }).cuid("Invalid Item ID"),
  }),
  body: z.object({
    quantity: z
      .number({ message: "Quantity must be a number" })
      .int()
      .min(1, "Quantity must be at least 1")
      .max(50, "Quantity cannot exceed 50 per item"),
  }),
});