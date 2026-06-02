import { z } from "zod";
import { VendorStatus } from "@prisma/client";

/**
 * Vendor Profile Update Validation
 */
export const updateVendorProfileSchema = z.object({
  body: z.object({
    storeName: z
      .string()
      .min(3, "Store name must be at least 3 characters")
      .max(50, "Store name cannot exceed 50 characters")
      .trim()
      .optional(),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional(),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .optional(),

    address: z
      .string()
      .max(255, "Address cannot exceed 255 characters")
      .optional(),

    city: z
      .string()
      .max(100, "City cannot exceed 100 characters")
      .optional(),

    state: z
      .string()
      .max(100, "State cannot exceed 100 characters")
      .optional(),

    pincode: z
      .string()
      .min(4, "Invalid pincode")
      .max(10, "Invalid pincode")
      .optional(),

    logo: z
      .string()
      .url("Logo must be a valid URL")
      .optional(),

    banner: z
      .string()
      .url("Banner must be a valid URL")
      .optional(),
  }),
});

/**
 * Admin Update Vendor Status
 */
export const updateVendorStatusSchema = z.object({
  params: z.object({
    vendorId: z
      .string()
      .cuid("Invalid Vendor ID format"),
  }),

  body: z.object({
    status: z.nativeEnum(VendorStatus),
  }),
});

/**
 * Vendor ID Param Validation
 */
export const vendorIdParamSchema = z.object({
  params: z.object({
    vendorId: z
      .string()
      .cuid("Invalid Vendor ID format"),
  }),
});