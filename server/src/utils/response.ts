import { Response } from "express";
import { HTTP_STATUS } from "../constants/index.js";

// ─────────────────────────────────────────────────────────
// Centralised API Response Helpers
// ─────────────────────────────────────────────────────────

interface SuccessPayload {
  res: Response;
  message?: string;
  data?: unknown;
  statusCode?: number;
  meta?: Record<string, unknown>;
}

interface ErrorPayload {
  res: Response;
  message: string;
  code?: string;
  statusCode?: number;
  errors?: unknown;
}

/**
 * Sends a consistent success JSON response.
 * All controllers must use this — never call res.json() directly.
 */
export const sendSuccess = ({
  res,
  message,
  data,
  statusCode = HTTP_STATUS.OK,
  meta,
}: SuccessPayload): void => {
  res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(meta && { ...meta }),
  });
};

/**
 * Sends a consistent error JSON response.
 * Prefer throwing AppError in services and letting errorHandler send the response.
 * Use this only for non-exceptional, inline error responses (e.g. webhooks).
 */
export const sendError = ({
  res,
  message,
  code = "ERROR",
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors,
}: ErrorPayload): void => {
  res.status(statusCode).json({
    success: false,
    code,
    message,
    ...(errors !== undefined && { errors }),
  });
};
