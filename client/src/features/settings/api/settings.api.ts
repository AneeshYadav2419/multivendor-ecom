import { api } from "@/lib/api/axios";
import { Setting } from "../types/settings.types";

export const settingsApi = {

    async getSettings() {
        const res = await api.get<{
            success: boolean;
            data: Setting;
        }>("/admin/settings");

        return res.data.data;
    },

    async updateSettings(
        data: Partial<Setting>
    ) {
        const res = await api.patch<{
            success: boolean;
            data: Setting;
        }>(
            "/admin/settings",
            data
        );

        return res.data.data;
    },
};