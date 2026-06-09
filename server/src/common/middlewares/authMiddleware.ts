// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import prisma from "../../config/prismaClient.js";
// import { env } from "../../config/env.js";
// import { AppError } from "./errorMiddleware.js";
// import { cache } from "../../config/redis.js";
// import { logger } from "../../utils/logger.js";

// const JWT_ACCESS_SECRET = env.JWT_SECRET;

// if (!JWT_ACCESS_SECRET) {
//   logger.error("FATAL: JWT_SECRET environment configuration is not defined. Server cannot operate securely.");
//   process.exit(1);
// }

// interface JwtPayload {
//   userId: string;
//   role: "CUSTOMER" | "VENDOR" | "ADMIN";
//   iat: number;
//   exp: number;
// }

// interface CachedUser {
//   id: string;
//   role: string;
//   isActive: boolean;
// }

// /**
//  * Extracts Bearer access token from Request headers or fallback httpOnly session cookies.
//  */
// const extractToken = (req: Request): string | undefined => {
//   const authHeader = req.headers.authorization;
//   if (authHeader?.toLowerCase().startsWith("bearer ")) {
//     return authHeader.split(" ")[1];
//   }
//   if (req.cookies?.access_token) {
//     return req.cookies.access_token as string;
//   }
//   return undefined;
// };

// // ─────────────────────────────────────────────────────────
// // Middlewares
// // ─────────────────────────────────────────────────────────

// /**
//  * Protect middleware: Verifies JWT token and resolves user context.
//  * Utilizes high-speed Redis session caching to bypass heavy database lookups.
//  */
// export const protect = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = extractToken(req);

//     if (!token) {
//       return next(new AppError("Authentication required. Please log in.", 401, "MISSING_TOKEN"));
//     }

//     let decoded: JwtPayload;
//     try {
//       decoded = jwt.verify(token, JWT_ACCESS_SECRET, {
//         issuer: "multivendor-api",
//         audience: "multivendor-client",
//       }) as JwtPayload;
//     } catch (err: unknown) {
//       if (err instanceof jwt.TokenExpiredError) {
//         return next(new AppError("Access token expired. Please refresh your session.", 401, "TOKEN_EXPIRED"));
//       }
//       return next(new AppError("Invalid access token. Please log in again.", 401, "INVALID_TOKEN"));
//     }

//     // ─────────────────────────────────────────────────────────
//     // Caching Layer Check (Redis)
//     // ─────────────────────────────────────────────────────────
//     const cacheKey = `user:session:${decoded.userId}`;
//     let currentUser = await cache.get<CachedUser>(cacheKey);

//     if (!currentUser) {
//       logger.debug(`Session cache miss for user: ${decoded.userId}. Querying PostgreSQL.`);

//       const dbUser = await prisma.user.findUnique({
//         where: { id: decoded.userId },
//         select: { id: true, role: true, isActive: true },
//       });

//       if (!dbUser) {
//         return next(new AppError("The account belonging to this token no longer exists.", 401, "USER_NOT_FOUND"));
//       }

//       currentUser = {
//         id: dbUser.id,
//         role: dbUser.role,
//         isActive: dbUser.isActive,
//       };

//       // Cache validated user profile in Redis for 5 minutes (300 seconds)
//       await cache.set(cacheKey, currentUser, 300);
//     } else {
//       logger.debug(`Session cache hit for user: ${decoded.userId}.`);
//     }

//     if (!currentUser.isActive) {
//       return next(new AppError("Your account has been deactivated. Please contact support.", 403, "ACCOUNT_DEACTIVATED"));
//     }

//     // Attach active user session payload to request context
//     req.user = {
//       userId: currentUser.id,
//       role: currentUser.role as "CUSTOMER" | "VENDOR" | "ADMIN",
//     };

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * restrictTo middleware: RBAC guard restricting route access strictly to specified roles.
//  * Must be executed after the protect middleware.
//  */
// export const restrictTo = (...roles: ("CUSTOMER" | "VENDOR" | "ADMIN")[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return next(new AppError("You do not have permission to perform this action.", 403, "FORBIDDEN"));
//     }
//     next();
//   };
// };

// /**
//  * checkVendorApproval middleware: Ensures authenticated VENDOR has active admin approval.
//  * Must be executed after protect + restrictTo("VENDOR").
//  */
// export const checkVendorApproval = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const vendorCacheKey = `vendor:status:${req.user!.userId}`;
//     let vendorStatus = await cache.get<string>(vendorCacheKey);

//     if (!vendorStatus) {
//       const vendor = await prisma.vendor.findUnique({
//         where: { userId: req.user!.userId },
//         select: { status: true },
//       });

//       if (!vendor) {
//         return next(new AppError("Vendor profile not found. Please register as a vendor.", 404, "VENDOR_NOT_FOUND"));
//       }

//       vendorStatus = vendor.status;
//       // Cache vendor status for 5 minutes
//       await cache.set(vendorCacheKey, vendorStatus, 300);
//     }

//     if (vendorStatus !== "APPROVED") {
//       let message = "Your vendor account is pending admin approval.";
//       let code = "VENDOR_PENDING";

//       if (vendorStatus === "REJECTED") {
//         message = "Your vendor application was rejected. Please contact support.";
//         code = "VENDOR_REJECTED";
//       } else if (vendorStatus === "SUSPENDED") {
//         message = "Your vendor account has been suspended due to policy violations.";
//         code = "VENDOR_SUSPENDED";
//       }

//       return next(new AppError(message, 403, code));
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";
import { env } from "../../config/env.js";
import { AppError } from "./errorMiddleware.js";
import { cache } from "../../config/redis.js";
import { logger } from "../../utils/logger.js";

const JWT_ACCESS_SECRET = env.JWT_SECRET;

if (!JWT_ACCESS_SECRET) {
  logger.error("FATAL: JWT_SECRET is missing");
  process.exit(1);
}

export type Role = "CUSTOMER" | "VENDOR" | "ADMIN";

interface JwtPayload {
  userId: string;
  role: Role;
  iat?: number;
  exp?: number;
}

interface CachedUser {
  id: string;
  role: Role;
  isActive: boolean;
}

/**
 * Extract token from header or cookie
 */
const extractToken = (req: Request): string | undefined => {
  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }

  return req.cookies?.access_token;
};

/**
 * Attach user type to request safely
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
      };
    }
  }
}

/**
 * AUTH PROTECT MIDDLEWARE
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next(new AppError("Authentication required", 401, "NO_TOKEN"));
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_ACCESS_SECRET, {
        issuer: "multivendor-api",
        audience: "multivendor-client",
      }) as JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(new AppError("Token expired", 401, "TOKEN_EXPIRED"));
      }
      return next(new AppError("Invalid token", 401, "INVALID_TOKEN"));
    }

    const cacheKey = `user:session:${decoded.userId}`;

    let user = await cache.get<CachedUser>(cacheKey);

    if (!user) {
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          role: true,
          isActive: true,
        },
      });

      if (!dbUser) {
        return next(new AppError("User not found", 401, "USER_NOT_FOUND"));
      }

      user = {
        id: dbUser.id,
        role: dbUser.role,
        isActive: dbUser.isActive,
      };

      await cache.set(cacheKey, user, 300);
    }

    if (!user.isActive) {
      return next(new AppError("Account deactivated", 403, "ACCOUNT_DISABLED"));
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * ROLE BASED ACCESS CONTROL
 */
export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401, "NO_USER"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403, "FORBIDDEN"));
    }

    next();
  };
};

/**
 * VENDOR APPROVAL CHECK
 */
export const checkVendorApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401, "NO_USER"));
    }

    const cacheKey = `vendor:status:${req.user.userId}`;

    let status = await cache.get<string>(cacheKey);

    if (!status) {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: req.user.userId },
        select: { status: true },
      });

      if (!vendor) {
        return next(
          new AppError("Vendor not found", 404, "VENDOR_NOT_FOUND")
        );
      }

      status = vendor.status;

      await cache.set(cacheKey, status, 300);
    }

    if (status !== "APPROVED") {
      const messages: Record<string, string> = {
        PENDING: "Vendor approval pending",
        REJECTED: "Vendor rejected",
        SUSPENDED: "Vendor suspended",
      };

      return next(
        new AppError(
          messages[status] || "Vendor not approved",
          403,
          "VENDOR_BLOCKED"
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};