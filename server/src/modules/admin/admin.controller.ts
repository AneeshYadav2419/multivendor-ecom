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