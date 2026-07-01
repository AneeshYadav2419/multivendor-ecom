import { Router } from "express";
import { protect } from "../../common/middlewares/authMiddleware.js";
import { validate } from "../../common/middlewares/validateMiddleware.js";
import * as userController from "./user.controller.js";
import {
    updateProfileSchema,
    changePasswordSchema,
} from "./user.validation.js";

const router = Router();

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", protect, userController.getProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update name and/or email
 * @access  Private
 */
router.put(
    "/profile",
    protect,
    validate(updateProfileSchema),
    userController.updateProfile
);

/**
 * @route   PUT /api/user/password
 * @desc    Change password
 * @access  Private
 */
router.put(
    "/password",
    protect,
    validate(changePasswordSchema),
    userController.changePassword
);

export default router;