import type { Express } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import vendorRoutes from "../modules/vendor/vendor.route.js";
import productRoutes from "../modules/products/product.routes.js";
import categoryRoutes from "../modules/category/categoryRoutes.js";
import cartRoutes from "../modules/cart/cart.route.js";
import orderRoutes from "../modules/orders/orders.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import adminVendorRoutes from "../modules/admin/admin.routes.js";
import adminProductRoutes
  from "../modules/admin/adminProduct.routes.js";
import vendorOrderRoutes from "../modules/orders/vendor-orders.routes.js";
import analyticsRoutes
  from "../modules/analytics/analytics.routes.js";
import couponRoutes
  from "../modules/coupons/coupon.routes.js";
import settingsRoutes
  from "../modules/settings/settings.routes.js";
import wishlistRoutes from "../modules/wishlist/wishlist.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import reviewRoutes from "../modules/reviews/review.routes.js";

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
  app.use(
    "/api/vendors/orders",
    vendorOrderRoutes
  );
  app.use(
    "/api/admin/analytics",
    analyticsRoutes
  );
  app.use(
    "/api/admin/coupons",
    couponRoutes
  );
  app.use(
    "/api/admin/settings",
    settingsRoutes
  );
  app.use("/api/coupons", couponRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/reviews", reviewRoutes);

};

