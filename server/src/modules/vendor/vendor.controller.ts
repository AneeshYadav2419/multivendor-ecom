import { Request, Response } from "express";
import { VendorStatus } from "@prisma/client";

import * as vendorService from "./vendor.service.js";
import { asyncHandler } from "../../common/middlewares/asyncHandler.js";

/**
 * Vendor: Get own profile
 */
export const getMyProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const profile = await vendorService.getVendorProfileService(
            req.user!.userId
        );

        res.status(200).json({
            success: true,
            message: "Vendor profile retrieved successfully",
            data: profile,
        });
    }
);

/**
 * Vendor: Update own profile
 */
export const updateMyProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const updatedProfile =
            await vendorService.updateVendorProfileService(
                req.user!.userId,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Vendor profile updated successfully",
            data: updatedProfile,
        });
    }
);

/**
 * Admin: Get vendors by status
 */
export const getVendorsByStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const status = req.query.status as VendorStatus;

        const vendors =
            await vendorService.getVendorsByStatusService(
                status
            );

        res.status(200).json({
            success: true,
            results: vendors.length,
            data: vendors,
        });
    }
);

/**
 * Admin: Approve / Reject / Suspend Vendor
 */
export const updateVendorStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const vendorId = req.params.vendorId as string;

        const { status }: {
            status: VendorStatus;
        } = req.body;

        const vendor =
            await vendorService.updateVendorStatusService(
                vendorId,
                status
            );

        res.status(200).json({
            success: true,
            message: `Vendor status updated to ${status}`,
            data: vendor,
        });
    }
);

/**
 * Admin: Get all vendors
 */
export const getAllVendors = asyncHandler(
    async (_req: Request, res: Response) => {
        const vendors =
            await vendorService.getAllVendorsService();

        res.status(200).json({
            success: true,
            results: vendors.length,
            data: vendors,
        });
    }
);

export const getDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        console.log("VENDOR SERVICE =", vendorService);
        console.log("VENDOR SERVICE KEYS =", Object.keys(vendorService));
        const stats = await vendorService.getDashboardStats(req.user!.userId);

        res.status(200).json({
            success: true,
            data: stats,
        });
    }
);