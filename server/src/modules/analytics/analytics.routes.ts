import { Router } from "express";
import * as analyticsController from "./analytics.controller.js";

const router = Router();

router.get(
    "/dashboard",
    analyticsController.getDashboardOverview
);

export default router;