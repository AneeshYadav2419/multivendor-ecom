import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/lib/api/admin";
import { AdminDashboardStats } from "../types";

export const useAdminDashboard = () => {
    return useQuery<AdminDashboardStats>({
        queryKey: ["admin-dashboard"],
        queryFn: getAdminDashboard,
        staleTime: 60000,
    });
};