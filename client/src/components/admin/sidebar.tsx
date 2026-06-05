// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { adminNavigation } from "@/features/admin/navigation";
// import { cn } from "@/lib/utils";

// export function AdminSidebar() {
//     const pathname = usePathname();

//     return (
//         <aside className="w-64 border-r bg-background min-h-screen">
//             <div className="h-16 flex items-center px-6 border-b">
//                 <h2 className="text-xl font-bold">Aura Admin</h2>
//             </div>

//             <nav className="p-4 space-y-2">
//                 {adminNavigation.map((item) => {
//                     const Icon = item.icon;

//                     const active = pathname === item.href;

//                     return (
//                         <Link
//                             key={item.href}
//                             href={item.href}
//                             className={cn(
//                                 "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
//                                 active
//                                     ? "bg-primary text-primary-foreground"
//                                     : "hover:bg-muted"
//                             )}
//                         >
//                             <Icon className="h-4 w-4" />
//                             <span>{item.title}</span>
//                         </Link>
//                     );
//                 })}
//             </nav>
//         </aside>
//     );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/features/admin/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export function AdminSidebar() {
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);

    return (
        <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-bold text-white shadow-lg">
                        A
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-white">
                            AuraMarket
                        </h2>

                        <p className="text-xs text-slate-400">
                            Admin Panel
                        </p>
                    </div>
                </div>
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
                                        "h-5 w-5 transition-transform duration-200",
                                        active
                                            ? "text-indigo-400"
                                            : "group-hover:scale-110"
                                    )}
                                />

                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-semibold text-white">
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
        </aside>
    );
}