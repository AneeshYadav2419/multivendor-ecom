"use client";

import { useAuthStore } from "@/store/useAuthStore";

export function AdminGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useAuthStore((state) => state.user);

    if (!user || user.role !== "ADMIN") {
        return null;
    }

    return <>{children}</>;
}