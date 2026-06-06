import { api } from "@/lib/api/axios";
import type { AdminUsersResponse } from "@/features/admin/types";

export const getAdminUsers =
    async (): Promise<AdminUsersResponse> => {
        const response =
            await api.get("/admin/users");

        return response.data;
    };