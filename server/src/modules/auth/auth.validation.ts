import { z } from "zod";

export const registerBodySchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  role: z
    .enum(["CUSTOMER", "VENDOR", "ADMIN"])
    .optional()
    .default("CUSTOMER"),
  storeName: z.string().min(2).max(100).trim().optional(),
}).refine(
  (data) => data.role !== "VENDOR" || !!data.storeName,
  {
    message: "Store name is required when registering as a vendor.",
    path: ["storeName"],
  }
);

export const loginBodySchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

// Wrapped schemas compatible with the validate middleware (which parses { body, query, params })
export const registerSchema = z.object({ body: registerBodySchema });
export const loginSchema = z.object({ body: loginBodySchema });
