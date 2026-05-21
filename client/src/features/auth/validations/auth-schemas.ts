import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

export const registerSchema = z
  .object({
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
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    role: z.enum(["CUSTOMER", "VENDOR"]),
    storeName: z.string().optional(),
  })
  .refine(
    (data) => data.role !== "VENDOR" || (!!data.storeName && data.storeName.trim() !== ""),
    {
      message: "Store name is required for vendor registration",
      path: ["storeName"],
    }
  );

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
