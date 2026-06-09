import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";
import { getDashboardStats } from "./admin.service.js";


// ✅ GET DASHBOARD STATS
export const getDashboard = catchAsync(async (_req: Request, res: Response) => {
  const stats = await getDashboardStats(); res.status(200).json({ success: true, data: stats, });
});

// ✅ GET PENDING VENDORS
export const getPendingVendors = catchAsync(async (_req: Request, res: Response) => {
  const vendors = await prisma.vendor.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: vendors,
  });
});


// ✅ APPROVE VENDOR
export const approveVendor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new AppError("Invalid vendor id", 400);
  }

  const vendor = await prisma.vendor.update({
    where: { id },
    data: {
      status: "APPROVED",
    },
  });

  res.status(200).json({
    success: true,
    message: "Vendor approved successfully",
    data: vendor,
  });
});


// ❌ REJECT VENDOR
export const rejectVendor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!id || Array.isArray(id)) {
    throw new AppError("Invalid vendor id", 400);
  }

  const vendor = await prisma.vendor.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason: reason || null,
    },
  });

  res.status(200).json({
    success: true,
    message: "Vendor rejected successfully",
    data: vendor,
  });
});


// ⛔ SUSPEND VENDOR
export const suspendVendor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new AppError("Invalid vendor id", 400);
  }

  const vendor = await prisma.vendor.update({
    where: { id },
    data: {
      status: "SUSPENDED",
    },
  });

  res.status(200).json({
    success: true,
    message: "Vendor suspended successfully",
    data: vendor,
  });
});

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      results: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const { search, status, page = "1", limit = "10" } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {
    AND: [
      status ? { status: status as any } : {},
      search
        ? {
          OR: [
            { id: { contains: search as string, mode: "insensitive" } },
            {
              customer: {
                name: { contains: search as string, mode: "insensitive" },
              },
            },
            {
              customer: {
                email: { contains: search as string, mode: "insensitive" },
              },
            },
          ],
        }
        : {},
    ],
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: "desc",
      },

      include: {
        customer: true,     // ✅ FIXED (was user)
        orderItems: {
          include: {
            product: true,
            vendor: true,
          },
        },
      },
    }),

    prisma.order.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  });
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new AppError("Invalid order id", 400);
  }

  const order = await prisma.order.findUnique({
    where: { id },

    include: {
      customer: true,
      orderItems: {
        include: {
          product: true,
          vendor: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});
export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    status,
    paymentStatus,
    razorpayPaymentId,
  } = req.body;

  if (!id || Array.isArray(id)) {
    throw new AppError("Invalid order id", 400);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },

    data: {
      status,                // OrderStatus enum
      paymentStatus,        // PaymentStatus enum
      razorpayPaymentId,
    },
  });

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    data: updatedOrder,
  });
});