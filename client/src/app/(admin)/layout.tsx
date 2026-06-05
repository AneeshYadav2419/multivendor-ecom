import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { AdminGuard } from "@/components/auth/admin-guard";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="flex min-h-screen">
                <AdminSidebar />

                <div className="flex flex-col flex-1">
                    <AdminHeader />

                    <main className="flex-1 p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}