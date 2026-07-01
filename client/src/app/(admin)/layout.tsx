"use client";

import { ReactNode, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { AdminGuard } from "@/components/auth/admin-guard";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <AdminGuard>
            <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
                {/* Mobile overlay */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                <AdminSidebar
                    isMobileOpen={isMobileOpen}
                    onClose={() => setIsMobileOpen(false)}
                />

                <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                    <AdminHeader onMenuClick={() => setIsMobileOpen(true)} />

                    <main className="flex-1 overflow-y-auto bg-slate-950">
                        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}