import { Request, Response } from "express";
import * as userService from "./user.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

/**
 * GET /api/user/profile
 * Returns current authenticated user's profile.
 */
export const getProfile = catchAsync(
    async (req: Request, res: Response) => {
        const user = await userService.getProfile(req.user!.userId);

        res.status(200).json({
            success: true,
            data: { user },
        });
    }
);

/**
 * PUT /api/user/profile
 * Updates name and/or email.
 */
export const updateProfile = catchAsync(
    async (req: Request, res: Response) => {
        const user = await userService.updateProfile(
            req.user!.userId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user },
        });
    }
);

/**
 * PUT /api/user/password
 * Changes password after verifying current password.
 */
export const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const result = await userService.changePassword(
            req.user!.userId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
);