import { Request, Response, NextFunction } from "express";
import * as vendorService from "../services/vendorService.js";

/**
 * Controller for vendors to fetch their own profile.
 */
export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await vendorService.getVendorProfileService(req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Vendor profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for vendors to update their store details.
 */
export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedProfile = await vendorService.updateVendorProfileService(
      req.user!.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for Admin to fetch vendors by status (e.g., PENDING).
 */
export const getVendorsByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;
    const vendors = await vendorService.getVendorsByStatusService(status as string as any);

    res.status(200).json({
      success: true,
      results: vendors.length,
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for Admin to update vendor status (Approve/Reject/Suspend).
 */
export const updateVendorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.params.vendorId as string;
    const { status, reason } = req.body;

    const vendor = await vendorService.updateVendorStatusService(
      vendorId,
      status,
      reason
    );

    res.status(200).json({
      success: true,
      message: `Vendor status updated to ${status} successfully`,
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for Admin to list all vendors.
 */
export const getAllVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await vendorService.getAllVendorsService();

    res.status(200).json({
      success: true,
      results: vendors.length,
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};