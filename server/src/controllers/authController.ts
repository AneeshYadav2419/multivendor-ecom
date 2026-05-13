import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "../services/authService.js";

// ─────────────────────────────────────────────────────────
// Cookie Config
// ─────────────────────────────────────────────────────────
const REFRESH_TOKEN_COOKIE = "refresh_token";

const refreshCookieOptions = {
  httpOnly: true, // Not accessible via JS — prevents XSS token theft
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict" as const, // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: "/api/auth", // Scoped: only sent to auth endpoints
};

// ─────────────────────────────────────────────────────────
// Validation Schemas (Zod)
// ─────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .trim(),
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters") // bcrypt limit
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    role: z
      .enum(["CUSTOMER", "VENDOR", "ADMIN"])
      .optional()
      .default("CUSTOMER"),
    storeName: z.string().min(2).max(100).trim().optional(),
  })
  .refine(
    (data) => data.role !== "VENDOR" || !!data.storeName,
    {
      message: "Store name is required when registering as a vendor.",
      path: ["storeName"],
    }
  );

const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

// ─────────────────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────────────────

/** POST /api/auth/register */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.registerUser(validatedData);

    res.status(201).json({
      success: true,
      message:
        validatedData.role === "VENDOR"
          ? "Vendor account created. Awaiting admin approval before your store goes live."
          : "Registration successful. Welcome aboard!",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/** POST /api/auth/login */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { tokens, user } = await authService.loginUser(validatedData);

    // Refresh token lives in an httpOnly cookie — never exposed to client JS
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        accessToken: tokens.accessToken, // Short-lived — client stores in memory only
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Issues a new access token + rotates the refresh token.
 * Accepts refresh token from httpOnly cookie (preferred) or request body (mobile).
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawRefreshToken =
      req.cookies?.[REFRESH_TOKEN_COOKIE] ?? req.body?.refreshToken;

    const { accessToken, newRefreshToken } =
      await authService.refreshAccessToken(rawRefreshToken);

    // Rotate cookie with the new refresh token
    res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Invalidates the current session (single device).
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawRefreshToken =
      req.cookies?.[REFRESH_TOKEN_COOKIE] ?? req.body?.refreshToken;

    await authService.logoutUser(rawRefreshToken);

    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
    });

    res.status(200).json({
      success: true,
      message: "You have been logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout-all
 * Invalidates ALL sessions for the authenticated user (all devices).
 */
export const logoutAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.logoutAllSessions(req.user!.userId);

    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
    });

    res.status(200).json({
      success: true,
      message: "All active sessions have been terminated.",
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/auth/me — Returns authenticated user's full profile */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getUserById(req.user!.userId);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
