import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import { RegisterDTO, LoginDTO } from "./auth.dto.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { logger } from "../../utils/logger.js";
import { env } from "../../config/env.js";

const REFRESH_TOKEN_COOKIE = "refresh_token";

const refreshCookieOptions = {
  httpOnly: true, // Prevents client-side JS from reading cookie, stopping XSS token theft
  secure: env.NODE_ENV === "production", // Enforces HTTPS-only transmission in production
  sameSite: "strict" as const, // Robust protection against Cross-Site Request Forgery (CSRF)
  maxAge: 7 * 24 * 60 * 60 * 1000, // Matches database session expiry (7 days)
  path: "/api/auth", // Limits cookie exposure strictly to authentication endpoints
};

/**
 * Handles new user account registrations.
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  // Parsing and validation are fully managed by the validate middleware upstream
  const validatedData: RegisterDTO = req.body;
  const user = await authService.registerUser(validatedData);

  res.status(201).json({
    success: true,
    message:
      validatedData.role === "VENDOR"
        ? "Vendor account created. Awaiting admin approval before your store goes live."
        : "Registration successful. Welcome aboard!",
    data: { user },
  });
});

/**
 * Handles user login and registers HttpOnly refresh cookie.
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const validatedData: LoginDTO = req.body;
  const { tokens, user } = await authService.loginUser(validatedData);

  // Set the refresh token inside a secure HttpOnly cookie
  res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshCookieOptions);

  logger.info(`Session initialized for User ID: ${user.id}`);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      accessToken: tokens.accessToken, // Short-lived in-memory token for SPA
      user,
    },
  });
});

/**
 * Handles session token rotation (Access + Refresh Rotation).
 */
export const refresh = catchAsync(async (req: Request, res: Response) => {
  // Support refresh token from cookie (SPA) or fallback to request body (Mobile client compatibility)
  const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] ?? req.body?.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(rawRefreshToken);

  // Rotate cookie with the newly generated refresh token
  res.cookie(REFRESH_TOKEN_COOKIE, newRefreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    data: { accessToken },
  });
});

/**
 * Log out user from their current active device.
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] ?? req.body?.refreshToken;

  await authService.logoutUser(rawRefreshToken);

  // Instantly clear client auth cookie with exact scoping matching creation options
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
  });

  res.status(200).json({
    success: true,
    message: "You have been logged out successfully.",
  });
});

/**
 * Log out user from ALL active sessions across all devices.
 */
export const logoutAll = catchAsync(async (req: Request, res: Response) => {
  // req.user is guaranteed to be set due to JWT protect middleware upstream
  await authService.logoutAllSessions(req.user!.userId);

  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
  });

  res.status(200).json({
    success: true,
    message: "All active sessions have been terminated successfully.",
  });
});

/**
 * Fetches authenticated user's current session profile.
 */
export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getUserById(req.user!.userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
});
