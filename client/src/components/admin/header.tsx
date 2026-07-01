"use client";

import { Bell, Search, LogOut, Menu } from "lucide-react";
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

interface AdminHeaderProps {
    onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
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
            <div className="flex h-full items-center justify-between px-4 sm:px-6 gap-4">
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <h1 className="text-base sm:text-xl font-semibold text-white truncate">
                            {title}
                        </h1>

                        <p className="hidden sm:block text-xs text-slate-400">
                            AuraMarket Administration
                        </p>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {/* Search — hidden on small screens */}
                    <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 w-48 lg:w-72">
                        <Search className="h-4 w-4 text-slate-500 shrink-0" />
                        <input
                            placeholder="Search..."
                            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-indigo-500 hover:text-white">
                        <Bell className="h-4 w-4" />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    {/* Profile — name hidden on small screens */}
                    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2 sm:px-3 py-2">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-semibold text-white text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        <div className="hidden lg:block max-w-[120px]">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.name || "Administrator"}
                            </p>

                            <p className="text-xs text-slate-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-red-500 hover:text-red-400"
                        aria-label="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}