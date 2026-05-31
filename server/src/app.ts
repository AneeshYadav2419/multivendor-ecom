import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { traceMiddleware } from "./common/middlewares/traceMiddleware.js";
import { errorHandler } from "./common/middlewares/errorMiddleware.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import { registerRoutes } from "./routes/index.js";


const app = express();

// Trace correlation ID wrapper (MUST BE FIRST)
app.use(traceMiddleware);

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Performance Middleware
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
  })
);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Webhooks (must be before body parsers)
app.use("/api/webhooks", webhookRoutes);

// Parsing
app.use(express.json({ limit: "10kb" })); // Body limit for security
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// API routes (see routes/index.ts for full registry)
registerRoutes(app);



// Health Check of the server 
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling (Must be last)
app.use(errorHandler);

export default app;