"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/features/admin/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { X } from "lucide-react";

interface AdminSidebarProps {
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isMobileOpen = false, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-bold text-white shadow-lg">
                        A
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-sm font-bold text-white truncate">
                            AuraMarket
                        </h2>

                        <p className="text-xs text-slate-400">
                            Admin Panel
                        </p>
                    </div>
                </div>

                {/* Mobile close button */}
                <button
                    onClick={onClose}
                    className="lg:hidden ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Platform
                </p>

                <nav className="space-y-1">
                    {adminNavigation.map((item) => {
                        const Icon = item.icon;

                        const active =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/");

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",

                                    active
                                        ? "bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 text-white border border-indigo-500/20"
                                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                )}
                            >
                                {active && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500" />
                                )}

                                <Icon
                                    className={cn(
                                        "h-5 w-5 shrink-0 transition-transform duration-200",
                                        active
                                            ? "text-indigo-400"
                                            : "group-hover:scale-110"
                                    )}
                                />

                                <span className="truncate">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-semibold text-white">
                        {user?.name?.charAt(0) || "A"}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                            {user?.name || "Administrator"}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                            {user?.email}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop sidebar — always visible on lg+ */}
            <aside className="hidden lg:flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 shrink-0">
                {sidebarContent}
            </aside>

            {/* Mobile sidebar — slide-in drawer */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 lg:hidden",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {sidebarContent}
            </aside>
        </>
    );
}