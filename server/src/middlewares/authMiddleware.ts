import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";
import { AppError } from "./errorMiddleware.js";

// ─────────────────────────────────────────────────────────
// Startup Guard — fail fast if secret is missing
// ─────────────────────────────────────────────────────────
const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET;

if (!JWT_ACCESS_SECRET) {
  console.error(
    "FATAL: JWT_ACCESS_SECRET is not defined. Server cannot start securely."
  );
  process.exit(1);
}

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface JwtPayload {
  userId: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  iat: number;
  exp: number;
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const extractToken = (req: Request): string | undefined => {
  const authHeader = req.headers.authorization;
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.split(" ")[1];
  }
  // Also support access token from httpOnly cookie (optional — for SSR clients)
  if (req.cookies?.access_token) {
    return req.cookies.access_token as string;
  }
  return undefined;
};

// ─────────────────────────────────────────────────────────
// Middleware: protect
// Verifies the access token and attaches user to req.user.
// DB check catches deactivated/deleted users with still-valid tokens.
// ─────────────────────────────────────────────────────────
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next(
        new AppError(
          "Authentication required. Please log in.",
          401,
          "MISSING_TOKEN"
        )
      );
    }

    // Verify signature + expiry
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_ACCESS_SECRET!, {
        issuer: "multivendor-api",
        audience: "multivendor-client",
      }) as JwtPayload;
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(
          new AppError(
            "Access token expired. Please refresh your session.",
            401,
            "TOKEN_EXPIRED"
          )
        );
      }
      return next(
        new AppError(
          "Invalid access token. Please log in again.",
          401,
          "INVALID_TOKEN"
        )
      );
    }

    // DB check: handle deleted users or deactivated accounts with live tokens
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, isActive: true },
    });

    if (!currentUser) {
      return next(
        new AppError(
          "The account belonging to this token no longer exists.",
          401,
          "USER_NOT_FOUND"
        )
      );
    }

    if (!currentUser.isActive) {
      return next(
        new AppError(
          "Your account has been deactivated. Please contact support.",
          403,
          "ACCOUNT_DEACTIVATED"
        )
      );
    }

    // Attach verified user to request
    req.user = {
      userId: currentUser.id,
      role: currentUser.role as "CUSTOMER" | "VENDOR" | "ADMIN",
    };

    next();
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────
// Middleware: restrictTo
// RBAC guard — restricts route to one or more allowed roles.
// Must be used AFTER protect.
// ─────────────────────────────────────────────────────────
export const restrictTo =
  (...roles: ("CUSTOMER" | "VENDOR" | "ADMIN")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          403,
          "FORBIDDEN"
        )
      );
    }
    next();
  };

// ─────────────────────────────────────────────────────────
// Middleware: checkVendorApproval
// Ensures the authenticated vendor has been approved by an admin.
// Must be used AFTER protect + restrictTo("VENDOR").
// ─────────────────────────────────────────────────────────
export const checkVendorApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user!.userId },
      select: { isApproved: true },
    });

    if (!vendor) {
      return next(
        new AppError(
          "Vendor profile not found. Please contact support.",
          404,
          "VENDOR_NOT_FOUND"
        )
      );
    }

    if (!vendor.isApproved) {
      return next(
        new AppError(
          "Your vendor account is pending admin approval. You will be notified once your store is approved.",
          403,
          "VENDOR_NOT_APPROVED"
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
