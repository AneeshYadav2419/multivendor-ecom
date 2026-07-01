import prisma from "../../config/prismaClient.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";
import bcrypt from "bcrypt";

export interface UpdateProfileDTO {
    name?: string;
    email?: string;
}

export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}

/**
 * Fetch a user by ID — same as auth.service.getUserById,
 * kept here so the user module is self-contained.
 */
export const getProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            isActive: true,
        },
    });

    if (!user) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;
};

/**
 * Update name and/or email.
 * Email uniqueness is enforced by the database unique constraint —
 * we catch that and return a clean error rather than exposing the raw DB error.
 */
export const updateProfile = async (
    userId: string,
    data: UpdateProfileDTO
) => {
    // Nothing to update
    if (!data.name && !data.email) {
        return getProfile(userId);
    }

    // If email is being changed, check it isn't already taken
    if (data.email) {
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
            select: { id: true },
        });

        if (existing && existing.id !== userId) {
            throw new AppError(
                "This email is already in use by another account",
                409,
                "EMAIL_TAKEN"
            );
        }
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            isActive: true,
        },
    });

    return updated;
};

/**
 * Change password.
 * Requires current password to be correct before allowing the update.
 * New password is hashed with bcrypt before storage.
 */
export const changePassword = async (
    userId: string,
    data: ChangePasswordDTO
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, password: true },
    });

    if (!user) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
        data.currentPassword,
        user.password
    );

    if (!isCurrentPasswordCorrect) {
        throw new AppError(
            "Current password is incorrect",
            400,
            "WRONG_PASSWORD"
        );
    }

    if (data.currentPassword === data.newPassword) {
        throw new AppError(
            "New password must be different from your current password",
            400,
            "SAME_PASSWORD"
        );
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return { message: "Password updated successfully" };
};