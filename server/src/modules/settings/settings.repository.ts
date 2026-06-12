import prisma from "../../config/prismaClient.js";
import { UpdateSettingsDto } from "./settings.types.js";

export const settingsRepository = {
    async findFirst() {
        return prisma.setting.findFirst();
    },

    async createDefault() {
        return prisma.setting.create({
            data: {
                storeName: "AuraMarket",
                supportEmail: "support@auramarket.com",
                supportPhone: "9999999999",
                currency: "INR",
                taxRate: 18,
                maintenanceMode: false,
            },
        });
    },

    async update(
        id: string,
        data: UpdateSettingsDto
    ) {
        return prisma.setting.update({
            where: { id },
            data,
        });
    },
};