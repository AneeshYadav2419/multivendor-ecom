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
export const getRevenueTrend = async (
    req: Request,
    res: Response
) => {
    const data =
        await analyticsService.getRevenueTrend();

    return res.status(200).json({
        success: true,
        data,
    });
};
export const getOrdersTrend = async (
    req: Request,
    res: Response
) => {
    const data =
        await analyticsService.getOrdersTrend();

    return res.status(200).json({
        success: true,
        data,
    });
};