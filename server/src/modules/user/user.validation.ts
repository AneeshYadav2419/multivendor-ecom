import { z } from "zod";

export const updateProfileSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be at most 50 characters")
            .optional(),
        email: z
            .string()
            .email("Please enter a valid email address")
            .optional(),
    }).refine(
        (data) => data.name !== undefined || data.email !== undefined,
        { message: "At least one field (name or email) must be provided" }
    ),
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z
            .string()
            .min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters")
            .max(100, "Password is too long"),
    }),
});