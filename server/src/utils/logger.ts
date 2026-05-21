import winston from "winston";
import { getRequestId } from "./context.js";

// Custom log formatter
const correlationIdFormatter = winston.format((info) => {
  const requestId = getRequestId();
  if (requestId) {
    info.requestId = requestId;
  }
  return info;
});

const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack, requestId, ...meta }) => {
    const trace = requestId ? ` [TraceID: ${requestId}]` : "";
    const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : "";
    const errStack = stack ? `\n${stack}` : "";
    return `[${timestamp}] ${level}${trace}: ${message}${metaStr}${errStack}`;
  })
);

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.errors({ stack: true }), // Include stack trace
    correlationIdFormatter(),
    process.env.NODE_ENV === "production" ? productionFormat : developmentFormat
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === "test",
    }),
  ],
});
