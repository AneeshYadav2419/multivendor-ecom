import { VendorStatus } from "@prisma/client";
import * as vendorRepository from "./vendor.repository.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";

/**
 * Fetch a vendor profile by the user ID.
 * Used by vendors to see their own data.
 */
export const getVendorProfileService = async (userId: string) => {
    const vendor = await vendorRepository.findVendorByUserId(userId);

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
    payload: { storeName?: string; description?: string }
) => {
    const vendor = await vendorRepository.findVendorByUserId(userId);

    if (!vendor) {
        throw new AppError("Vendor profile not found", 404, "VENDOR_NOT_FOUND");
    }

    return vendorRepository.updateVendorProfile(userId, payload);
};

/**
 * Get all vendors for admin dashboard.
 */
export const getAllVendorsService = async () => {
    return vendorRepository.getAllVendors();
};

/**
 * Get all vendors with a specific status.
 * Primarily used by Admin to find PENDING applications.
 */
export const getVendorsByStatusService = async (status: VendorStatus) => {
    return vendorRepository.getVendorsByStatus(status);
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
    const vendor = await vendorRepository.findVendorById(vendorId);

    if (!vendor) {
        throw new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND");
    }

    if (vendor.status === status) {
        throw new AppError(`Vendor is already ${status}`, 400, "BAD_REQUEST");
    }

    return vendorRepository.updateVendorStatus(vendorId, status);
};
