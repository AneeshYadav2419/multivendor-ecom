"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/lib/api/users.api"

export const useAdminUsers = () => {
    const usersQuery = useQuery({
        queryKey: ["admin", "users"],
        queryFn: getAdminUsers,
    });

    return {
        usersData: usersQuery.data,
        isLoadingUsers: usersQuery.isLoading,
    };
};