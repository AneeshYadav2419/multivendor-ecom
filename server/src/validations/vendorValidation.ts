import { z } from "zod";
import { VendorStatus } from "@prisma/client";

/**
 * Validation for updating vendor profile.
 * Used by vendors to change their store details.
 */
export const updateVendorProfileSchema = z.object({
  body: z.object({
    storeName: z
      .string({ required_error: "Store name is required" })
      .min(3, "Store name must be at least 3 characters")
      .max(50, "Store name cannot exceed 50 characters")
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional(),
  }),
});

/**
 * Validation for admin updating vendor status.
 * Ensures the status is valid and a reason is provided if rejected/suspended.
 */
export const updateVendorStatusSchema = z.object({
  params: z.object({
    vendorId: z.string({ required_error: "Vendor ID is required" }).cuid("Invalid Vendor ID format"),
  }),
  body: z.object({
    status: z.nativeEnum(VendorStatus, {
      errorMap: () => ({ message: "Status must be PENDING, APPROVED, REJECTED, or SUSPENDED" }),
    }),
    reason: z.string().max(255, "Reason cannot exceed 255 characters").optional(),
  }).refine((data) => {
    if ((data.status === VendorStatus.REJECTED || data.status === VendorStatus.SUSPENDED) && !data.reason) {
      return false;
    }
    return true;
  }, {
    message: "A reason is required when rejecting or suspending a vendor",
    path: ["reason"],
  }),
});

/**
 * Validation for routes that only require a vendorId param.
 */
export const vendorIdParamSchema = z.object({
  params: z.object({
    vendorId: z.string({ required_error: "Vendor ID is required" }).cuid("Invalid Vendor ID format"),
  }),
});
