import prisma from "../config/prismaClient.js";
import { AppError } from "../common/middlewares/errorMiddleware.js";

/**
 * Add an item to the cart or update quantity if it already exists.
 */
export const addToCartService = async (userId: string, productId: string, quantity: number) => {
  // 1. Validate Product & Stock
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true, isActive: true },
  });

  if (!product || !product.isActive) {
    throw new AppError("Product not found or unavailable", 404, "PRODUCT_NOT_FOUND");
  }

  if (product.stock < quantity) {
    throw new AppError(`Only ${product.stock} items left in stock`, 400, "INSUFFICIENT_STOCK");
  }

  // 2. Get or Create Cart
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // 3. Check if item already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new AppError("Requested quantity exceeds available stock", 400, "STOCK_EXCEEDED");
    }

    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  }

  // 4. Create New Item
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

/**
 * Update the quantity of a specific cart item.
 */
export const updateCartItemQuantityService = async (userId: string, itemId: string, quantity: number) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { 
      cart: { select: { userId: true } },
      product: { select: { stock: true } }
    },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new AppError("Cart item not found", 404, "ITEM_NOT_FOUND");
  }

  if (cartItem.product.stock < quantity) {
    throw new AppError(`Only ${cartItem.product.stock} items left in stock`, 400, "INSUFFICIENT_STOCK");
  }

  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
};

/**
 * Remove a specific item from the cart.
 */
export const removeFromCartService = async (userId: string, itemId: string) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: { select: { userId: true } } },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new AppError("Cart item not found", 404, "ITEM_NOT_FOUND");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });
};

/**
 * Empty the entire cart.
 */
export const clearCartService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};

/**
 * Get the current user's cart with totals.
 */
export const getCartService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              stock: true,
              slug: true
            },
          },
        },
      },
    },
  });

  if (!cart) return null;

  // Calculate totals
  const totalAmount = cart.items.reduce((acc, item) => {
    return acc + Number(item.product.price) * item.quantity;
  }, 0);

  return {
    ...cart,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    itemCount: cart.items.length,
  };
};