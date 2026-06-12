import { Request, Response }
    from "express";

import { settingsService }
    from "./settings.service.js";

export const getSettings = async (
    req: Request,
    res: Response
) => {
    const settings =
        await settingsService.getSettings();

    res.status(200).json({
        success: true,
        data: settings,
    });
};

export const updateSettings = async (
    req: Request,
    res: Response
) => {
    const settings =
        await settingsService.updateSettings(
            req.body
        );

    res.status(200).json({
        success: true,
        data: settings,
    });
};