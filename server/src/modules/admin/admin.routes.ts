import { Router } from "express";
import * as adminController from "./admin.controller.js";

import {
  protect,
  restrictTo,
} from "../../common/middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  restrictTo("ADMIN"),
  adminController.getDashboard
);

router.get(
  "/pending",
  protect,
  restrictTo("ADMIN"),
  adminController.getPendingVendors
);

router.patch(
  "/:id/approve",
  protect,
  restrictTo("ADMIN"),
  adminController.approveVendor
);

router.patch(
  "/:id/reject",
  protect,
  restrictTo("ADMIN"),
  adminController.rejectVendor
);

router.patch(
  "/:id/suspend",
  protect,
  restrictTo("ADMIN"),
  adminController.suspendVendor
);


export default router;