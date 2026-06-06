"use client";

import { useState } from "react";

import { useAdminUsers } from "@/features/admin/hooks/use-admin-users";

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");

    const {
        usersData,
        isLoadingUsers,
    } = useAdminUsers();

    if (isLoadingUsers) {
        return (
            <div className="p-6">
                Loading users...
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
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    Users
                </h1>

                <p className="text-muted-foreground">
                    Registered platform users
                </p>
            </div>

            {/* Stats */}
            <div className="rounded-lg border p-5">
                <p className="text-sm text-muted-foreground">
                    Total Users
                </p>

                <p className="text-3xl font-bold">
                    {usersData?.results || 0}
                </p>
            </div>

            {/* Search */}
            <div>
                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search users..."
                    className="w-full rounded-md border p-3"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left">
                                Name
                            </th>

                            <th className="p-3 text-left">
                                Email
                            </th>

                            <th className="p-3 text-left">
                                Role
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-left">
                                Joined
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b"
                            >
                                <td className="p-3 font-medium">
                                    {user.name}
                                </td>

                                <td className="p-3">
                                    {user.email}
                                </td>

                                <td className="p-3">
                                    {user.role}
                                </td>

                                <td className="p-3">
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${user.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {user.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>

                                <td className="p-3">
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}