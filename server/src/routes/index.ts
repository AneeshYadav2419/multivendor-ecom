import type { Express } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import vendorRoutes from "../modules/vendor/vendor.route.js";
import productRoutes from "../modules/products/product.routes.js";
import categoryRoutes from "./categoryRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

/**
 * Central route registry — single place to see all API mounts.
 * When migrating to modules/, only change imports here (e.g. modules/products/product.routes.js).
 */
export const registerRoutes = (app: Express): void => {
  app.use("/api/auth", authRoutes);
  app.use("/api/vendors", vendorRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payments", paymentRoutes);
};
