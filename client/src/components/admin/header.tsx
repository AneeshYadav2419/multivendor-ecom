"use client";

import { useAuthStore } from "@/store/useAuthStore";

export function AdminHeader() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
            <div>
                <h1 className="font-semibold">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                    {user?.email}
                </span>
            </div>
        </header>
    );
}