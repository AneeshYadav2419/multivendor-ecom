import type { Express } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import vendorRoutes from "../modules/vendor/vendor.route.js";
import productRoutes from "../modules/products/product.routes.js";
import categoryRoutes from "../modules/category/categoryRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import adminVendorRoutes from "../modules/admin/admin.routes.js";
import adminProductRoutes
  from "../modules/admin/adminProduct.routes.js";



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
  app.use("/api/admin", adminRoutes);
  app.use("/api/admin/vendors", adminVendorRoutes);
  app.use("/api/admin/products", adminProductRoutes);

};
