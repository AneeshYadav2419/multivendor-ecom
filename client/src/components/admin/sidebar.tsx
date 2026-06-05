"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/features/admin/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-background min-h-screen">
            <div className="h-16 flex items-center px-6 border-b">
                <h2 className="text-xl font-bold">Aura Admin</h2>
            </div>

            <nav className="p-4 space-y-2">
                {adminNavigation.map((item) => {
                    const Icon = item.icon;

                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                active
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}