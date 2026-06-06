import { z } from "zod";

/**
 * Validation for creating a new category.
 */
export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Category name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .trim(),
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional(),
  }),
});

/**
 * Validation for updating an existing category.
 */
export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).trim().optional(),
    description: z.string().max(500).trim().optional(),
  }),
});
