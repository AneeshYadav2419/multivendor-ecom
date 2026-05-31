import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { requestContextStore } from "../../utils/context.js";

/**
 * Middleware to track request correlation IDs for logging and debugging.
 */
export const traceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract existing Request-ID if present (e.g. from gateway/proxy) or generate a new cryptographically random UUID
  const requestId = (req.headers["x-request-id"] as string) || crypto.randomUUID();

  // Attach request ID to request context and outgoing response headers
  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);

  // Wrap the entire request execution path within AsyncLocalStorage execution context
  requestContextStore.run({ requestId }, () => {
    next();
  });
};
