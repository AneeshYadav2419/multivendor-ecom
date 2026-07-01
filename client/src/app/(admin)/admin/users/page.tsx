"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useAdminUsers } from "@/features/admin/hooks/use-admin-users";

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");

    const {
        usersData,
        isLoadingUsers,
    } = useAdminUsers();

    if (isLoadingUsers) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    const users =
        usersData?.data?.filter((user) =>
            user.name
                .toLowerCase()
                .includes(search.toLowerCase())
        ) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Users
                </h1>

                <p className="text-muted-foreground mt-1">
                    Registered platform users
                </p>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-sm text-muted-foreground">
                    Total Users
                </p>

                <p className="text-3xl font-bold mt-1">
                    {usersData?.results || 0}
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px]">
                        <thead className="border-b border-slate-800">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-slate-400">
                                    Name
                                </th>

                                <th className="p-4 text-left text-sm font-semibold text-slate-400">
                                    Email
                                </th>

                                <th className="p-4 text-left text-sm font-semibold text-slate-400">
                                    Role
                                </th>

                                <th className="p-4 text-left text-sm font-semibold text-slate-400">
                                    Status
                                </th>

                                <th className="p-4 text-left text-sm font-semibold text-slate-400">
                                    Joined
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-slate-800 hover:bg-slate-800/20"
                                >
                                    <td className="p-4 font-medium text-white">
                                        {user.name}
                                    </td>

                                    <td className="p-4 text-slate-300 text-sm">
                                        {user.email}
                                    </td>

                                    <td className="p-4">
                                        <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${user.isActive
                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                }`}
                                        >
                                            {user.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}