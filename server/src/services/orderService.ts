// services/orderService.ts

import prisma from "../config/prismaClient.js";
import { AppError } from "../middlewares/errorMiddleware.js";
import { PaymentMethod } from "@prisma/client";

/**
 * PLACE ORDER SERVICE
 */
export const placeOrderService = async (
    userId: string,
    shippingAddress: string,
    paymentMethod: PaymentMethod
) => {
    // 1. Get user's cart
    const cart = await prisma.cart.findUnique({
        where: { userId },

        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    // 2. Check cart exists
    if (!cart || cart.items.length === 0) {
        throw new AppError(
            "Cart is empty.",
            400,
            "EMPTY_CART"
        );
    }

    // 3. Validate stock + calculate total
    let totalAmount = 0;

    for (const item of cart.items) {

        // Product inactive
        if (!item.product.isActive) {
            throw new AppError(
                `${item.product.name} is unavailable.`,
                400,
                "PRODUCT_INACTIVE"
            );
        }

        // Stock validation
        if (item.quantity > item.product.stock) {
            throw new AppError(
                `Not enough stock for ${item.product.name}`,
                400,
                "INSUFFICIENT_STOCK"
            );
        }

        // Total calculation
        totalAmount += Number(item.product.price) * item.quantity;
    }

    // 4. Transaction (important for production)
    const order = await prisma.$transaction(async (tx) => {

        // Create order
        const createdOrder = await tx.order.create({
            data: {
                customerId: userId,
                totalAmount,
                shippingAddress,
                paymentMethod,

                orderItems: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },

            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: true,
                            },
                        },
                    },
                },
            },
        });

        // Reduce stock
        for (const item of cart.items) {
            await tx.product.update({
                where: {
                    id: item.productId,
                },

                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        // Clear cart
        await tx.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });

        return createdOrder;
    });

    return order;
};

/**
 * GET MY ORDERS
 */
export const getMyOrdersService = async (userId: string) => {

    return await prisma.order.findMany({
        where: {
            customerId: userId,
        },

        orderBy: {
            createdAt: "desc",
        },

        include: {
            orderItems: {
                include: {
                    product: {
                        select: {
                            name: true,
                            images: true,
                        },
                    },
                },
            },
        },
    });
};

/**
 * GET SINGLE ORDER
 */
export const getOrderByIdService = async (
    orderId: string,
    userId: string
) => {

    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            customerId: userId,
        },

        include: {
            orderItems: {
                include: {
                    product: {
                        select: {
                            name: true,
                            images: true,
                        },
                    },
                },
            },
        },
    });

    if (!order) {
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        );
    }

    return order;
};