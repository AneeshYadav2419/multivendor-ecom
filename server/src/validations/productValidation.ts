import { z } from "zod";

/**
 * Validation for creating a new product.
 */
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Product name is required" })
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters")
      .trim(),
    description: z
      .string({ message: "Description is required" })
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description cannot exceed 2000 characters")
      .trim(),
    price: z
      .number({ message: "Price is required" })
      .positive("Price must be greater than 0"),
    stock: z
      .number({ message: "Stock is required" })
      .int()
      .nonnegative("Stock cannot be negative"),
    categoryId: z.string({ message: "Category ID is required" }).cuid("Invalid Category ID"),
    images: z
      .array(z.string().url("Each image must be a valid URL"), {
        message: "Images must be an array of URLs",
      })
      .min(1, "At least one image is required"),
    isActive: z.boolean().optional().default(true),
  }),
});

/**
 * Validation for updating an existing product.
 * All fields are optional.
 */
export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).trim().optional(),
    description: z.string().min(10).max(2000).trim().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().cuid().optional(),
    images: z.array(z.string().url()).min(1).optional(),
    isActive: z.boolean().optional(),
  }),
});

/**
 * Validation for product list filters and pagination.
 */
export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
    search: z.string().optional(),
    minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    categoryId: z.string().optional(),
    sortBy: z.enum(["price_asc", "price_desc", "newest", "oldest"]).optional().default("newest"),
  }),
});
