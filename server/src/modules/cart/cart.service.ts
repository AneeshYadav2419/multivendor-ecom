import prisma from "../../config/prismaClient.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";
import { AddToCartDTO } from "./cart.types.js";

export const getCart = async (userId: string) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            category: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!cart) {
        return {
            items: [],
            totalItems: 0,
            totalAmount: 0,
        };
    }

    const totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalAmount = cart.items.reduce(
        (sum, item) =>
            sum + Number(item.product.price) * item.quantity,
        0
    );

    return {
        id: cart.id,
        items: cart.items,
        totalItems,
        totalAmount,
    };
};

export const addToCart = async (
    userId: string,
    data: AddToCartDTO
) => {
    // Check Product Exists
    const product = await prisma.product.findUnique({
        where: {
            id: data.productId,
        },
    });

    if (!product) {
        throw new AppError(
            "Product not found",
            404,
            "PRODUCT_NOT_FOUND"
        );
    }

    if (product.status !== "ACTIVE") {
        throw new AppError(
            "Product is not available",
            400,
            "PRODUCT_INACTIVE"
        );
    }

    // Stock Validation
    if (product.stock < data.quantity) {
        throw new AppError(
            "Insufficient stock",
            400,
            "INSUFFICIENT_STOCK"
        );
    }

    // Find Cart
    let cart = await prisma.cart.findUnique({
        where: {
            userId,
        },
    });

    // Auto Create Cart
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId,
            },
        });
    }

    // Check Existing Item
    const existingItem =
        await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: data.productId,
                },
            },
        });

    // Product Already Exists In Cart
    if (existingItem) {
        const newQuantity =
            existingItem.quantity + data.quantity;

        if (newQuantity > product.stock) {
            throw new AppError(
                "Insufficient stock",
                400,
                "INSUFFICIENT_STOCK"
            );
        }

        await prisma.cartItem.update({
            where: {
                id: existingItem.id,
            },
            data: {
                quantity: newQuantity,
            },
        });
    } else {
        // Create New Cart Item
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: data.productId,
                quantity: data.quantity,
            },
        });
    }

    return getCart(userId);
};