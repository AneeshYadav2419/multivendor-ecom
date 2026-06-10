import { Request, Response } from "express";
import { analyticsService } from "./analytics.service.js";

export const getDashboardOverview = async (
    req: Request,
    res: Response
) => {
    const data =
        await analyticsService.getDashboardOverview();

    return res.status(200).json({
        success: true,
        data,
    });
};