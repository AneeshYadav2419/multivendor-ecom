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
export default router;