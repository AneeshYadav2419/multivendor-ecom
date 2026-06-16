
import prisma from "../../config/prismaClient.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";
import type { PlaceOrderInput } from "./order.types.js";

/**
 * PLACE ORDER SERVICE (OPTIMIZED)
 * 
 */

export const placeOrderService = async (
    userId: string,
    data: PlaceOrderInput
) => {

    let totalAmount = 0;
    let discountAmount = 0;
    let finalAmount = 0;

    const {
        shippingName,
        shippingPhone,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        pincode,
        paymentMethod,
        couponCode,
    } = data;

    console.log("COUPON RECEIVED:", couponCode);



    // 1. Get cart
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

    if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty.", 400, "EMPTY_CART");
    }

    // 2. Validate + calculate total
    totalAmount = 0;

    for (const item of cart.items) {
        const product = item.product;

        if (product.status !== "ACTIVE") {
            throw new AppError(
                `${product.name} is unavailable.`,
                400,
                "PRODUCT_INACTIVE"
            );
        }

        if (item.quantity > product.stock) {
            throw new AppError(
                `Not enough stock for ${product.name}`,
                400,
                "INSUFFICIENT_STOCK"
            );
        }

        totalAmount += Number(product.price) * item.quantity;
    }
    if (couponCode) {
        const coupon =
            await prisma.coupon.findFirst({
                where: {
                    code: couponCode,
                    isActive: true,
                },
            });

        if (coupon) {
            if (
                coupon.discountType ===
                "PERCENTAGE"
            ) {
                discountAmount =
                    (totalAmount *
                        coupon.discountValue) /
                    100;
            }

            if (
                coupon.discountType ===
                "FIXED"
            ) {
                discountAmount =
                    coupon.discountValue;
            }
        }
    }

    finalAmount =
        totalAmount - discountAmount;

    console.log("TOTAL:", totalAmount);
    console.log("DISCOUNT:", discountAmount);
    console.log("FINAL:", finalAmount);



    // 3. FAST TRANSACTION (optimized)
    const order = await prisma.$transaction(async (tx) => {
        console.log("SAVING ORDER AMOUNT:", finalAmount);
        // 3.1 Create order (minimal include - FAST)
        const createdOrder = await tx.order.create({

            data: {
                customerId: userId,
                totalAmount: finalAmount,

                shippingName,
                shippingPhone,
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                pincode,
                paymentMethod,

                orderItems: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        vendorId: item.product.vendorId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        });

        // 3.2 Parallel stock update (IMPORTANT FIX)
        await Promise.all(
            cart.items.map((item) =>
                tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                })
            )
        );

        return createdOrder;
    });

    // 4. OUTSIDE transaction (VERY IMPORTANT)
    await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
    });

    // 5. Fetch order separately (light query)
    return await prisma.order.findUnique({
        where: { id: order.id },
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
 * GET MY ORDERS (OK but slightly optimized)
 */
export const getMyOrdersService = async (userId: string) => {
    return await prisma.order.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: "desc" },
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
        throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
    }

    return order;
};