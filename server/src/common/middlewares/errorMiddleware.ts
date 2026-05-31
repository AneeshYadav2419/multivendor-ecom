import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

// ─────────────────────────────────────────────────────────
// Centralised Application Error Class
// ─────────────────────────────────────────────────────────
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    // Maintain correct prototype chain for `instanceof` checks
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─────────────────────────────────────────────────────────
// Global Error Handler (must be the last middleware)
// ─────────────────────────────────────────────────────────
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV !== "production";

  // 1. Operational AppErrors — thrown intentionally by the application
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code ?? "APP_ERROR",
      message: err.message,
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // 2. Zod Validation Errors (Zod v4: path is PropertyKey[], issues replaces errors)
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.map(String).join("."),
      message: issue.message,
    }));
    res.status(422).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Request validation failed.",
      errors,
    });
    return;
  }

  // 3. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field =
        (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
      res.status(409).json({
        success: false,
        code: "DUPLICATE_ENTRY",
        message: `A record with this ${field} already exists.`,
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "The requested resource was not found.",
      });
      return;
    }
  }

  // 4. Unknown / programmer errors — log fully, respond generically
  console.error("[UNHANDLED ERROR]", err);

  res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred. Please try again later.",
    ...(isDev && {
      detail: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
};
