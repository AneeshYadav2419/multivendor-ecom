import { VendorStatus } from "@prisma/client";
import prisma from "../config/prismaClient.js";
import { AppError } from "../common/middlewares/errorMiddleware.js";

/**
 * Fetch a vendor profile by the user ID.
 * Used by vendors to see their own data.
 */
export const getVendorProfileService = async (userId: string) => {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
    select: {
      id: true,
      storeName: true,
      description: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!vendor) {
    throw new AppError("Vendor profile not found", 404, "VENDOR_NOT_FOUND");
  }

  return vendor;
};

/**
 * Update vendor profile details.
 * Allows changing store name and description.
 */
export const updateVendorProfileService = async (
  userId: string,
  data: { storeName?: string; description?: string }
) => {
  // We use updateMany or find first to ensure the vendor belongs to this user
  const vendor = await prisma.vendor.findUnique({ where: { userId } });

  if (!vendor) {
    throw new AppError("Vendor profile not found", 404, "VENDOR_NOT_FOUND");
  }

  return await prisma.vendor.update({
    where: { userId },
    data,
    select: {
      id: true,
      storeName: true,
      description: true,
      status: true,
    },
  });
};

/**
 * Get all vendors with a specific status.
 * Primarily used by Admin to find PENDING applications.
 */
export const getVendorsByStatusService = async (status?: VendorStatus) => {
  return await prisma.vendor.findMany({
    where: status ? { status } : {},
    select: {
      id: true,
      storeName: true,
      description: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Update a vendor's status (APPROVE, REJECT, SUSPEND).
 * Only accessible by ADMIN.
 */
export const updateVendorStatusService = async (
  vendorId: string,
  status: VendorStatus,
  reason?: string
) => {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  if (!vendor) {
    throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");
  }

  // Business Logic: Don't re-approve if already approved (unless suspended)
  if (vendor.status === status) {
    throw new AppError(`Vendor is already ${status}`, 400, "BAD_REQUEST");
  }

  return await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      status,
      // In a real app, you might store the reason in a separate VendorAudit log
    },
    select: {
      id: true,
      storeName: true,
      status: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });
};

/**
 * Get all vendors for admin dashboard.
 */
export const getAllVendorsService = async () => {
  return await prisma.vendor.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          isActive: true,
        },
      },
    },
  });
};