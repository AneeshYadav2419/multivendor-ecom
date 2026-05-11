import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn("WARNING: JWT_SECRET is not defined in environment variables. Using fallback for development only.");
}

/**
 * Protect middleware to ensure user is authenticated
 */
export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;

        // 1. Get token from Authorization header OR cookie
        if (
            req.headers.authorization &&
            req.headers.authorization.toLowerCase().startsWith("bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not logged in. Please log in to get access.",
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, JWT_SECRET || "fallback_secret") as {
            userId: string;
            role: "CUSTOMER" | "VENDOR" | "ADMIN";
            iat: number;
            exp: number;
        };

        // 4. Check if user still exists in DB (to handle deleted users with valid tokens)
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "The user belonging to this token no longer exists.",
            });
        }

        // 5. Grant access to protected route
        req.user = {
            userId: currentUser.id,
            role: currentUser.role as "CUSTOMER" | "VENDOR" | "ADMIN",
        };

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Your token has expired. Please log in again.",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid token. Please log in again.",
        });
    }
};

/**
 * Middleware to restrict access based on roles
 */
export const restrictTo = (...roles: ("CUSTOMER" | "VENDOR" | "ADMIN")[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }
        next();
    };
};

