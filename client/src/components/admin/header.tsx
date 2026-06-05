"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const pageTitles: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/vendors": "Vendors",
    "/admin/products": "Products",
    "/admin/categories": "Categories",
    "/admin/orders": "Orders",
    "/admin/users": "Users",
    "/admin/reviews": "Reviews",
    "/admin/coupons": "Coupons",
    "/admin/analytics": "Analytics",
    "/admin/settings": "Settings",
};

export function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const title = pageTitles[pathname] || "Admin Panel";

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex h-full items-center justify-between px-6">
                {/* Left */}
                <div>
                    <h1 className="text-xl font-semibold text-white">
                        {title}
                    </h1>

                    <p className="text-xs text-slate-400">
                        AuraMarket Administration
                    </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 w-72">
                        <Search className="h-4 w-4 text-slate-500" />
                        <input
                            placeholder="Search..."
                            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-indigo-500 hover:text-white">
                        <Bell className="h-5 w-5" />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    {/* Profile */}
                    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-semibold text-white">
                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-white">
                                {user?.name || "Administrator"}
                            </p>

                            <p className="text-xs text-slate-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-red-500 hover:text-red-400"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}