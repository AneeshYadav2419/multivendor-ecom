import { Router } from "express";
import * as analyticsController from "./analytics.controller.js";

const router = Router();

router.get(
    "/dashboard",
    analyticsController.getDashboardOverview
);
router.get(
    "/revenue-trend",
    analyticsController.getRevenueTrend
);
router.get(
    "/orders-trend",
    analyticsController.getOrdersTrend
);
router.get(
    "/top-products",
    analyticsController.getTopProducts
);
export default router;