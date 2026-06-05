"use client";

import { useMemo, useState } from "react";

import {
    Search,
    Store,
    CheckCircle2,
    Clock3,
    Ban,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";

import { useAdminVendors } from "@/features/admin/hooks/use-admin-vendors";

export default function VendorsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const {
        vendorsData,
        isLoadingVendors,

        approveVendor,
        rejectVendor,
        suspendVendor,

        isApproving,
        isRejecting,
        isSuspending,
    } = useAdminVendors(status || undefined);

    const vendors = vendorsData?.data ?? [];

    const filteredVendors = useMemo(() => {
        const query = search.toLowerCase();

        return vendors.filter((vendor) => {
            return (
                vendor.storeName.toLowerCase().includes(query) ||
                vendor.user.name.toLowerCase().includes(query) ||
                vendor.user.email.toLowerCase().includes(query)
            );
        });
    }, [vendors, search]);

    const approvedCount = vendors.filter(
        (v) => v.status === "APPROVED"
    ).length;

    const pendingCount = vendors.filter(
        (v) => v.status === "PENDING"
    ).length;

    const suspendedCount = vendors.filter(
        (v) => v.status === "SUSPENDED"
    ).length;

    if (isLoadingVendors) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }
    if (!isLoadingVendors && !vendorsData) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
                    <h2 className="text-lg font-semibold text-red-400">
                        Failed to load vendors
                    </h2>

                    <p className="text-sm text-slate-400 mt-2">
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}

            <div>
                <h1 className="text-3xl font-bold">
                    Vendors Management
                </h1>

                <p className="text-muted-foreground">
                    Manage marketplace vendors and approvals.
                </p>
            </div>

            {/* Stats */}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Vendors"
                    value={vendors.length}
                    icon={<Store className="h-5 w-5" />}
                />

                <StatCard
                    title="Approved Vendors"
                    value={approvedCount}
                    icon={<CheckCircle2 className="h-5 w-5" />}
                />

                <StatCard
                    title="Pending Vendors"
                    value={pendingCount}
                    icon={<Clock3 className="h-5 w-5" />}
                />

                <StatCard
                    title="Suspended Vendors"
                    value={suspendedCount}
                    icon={<Ban className="h-5 w-5" />}
                />
            </div>

            {/* Search + Filters */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                        <Input
                            placeholder="Search vendors..."
                            className="pl-10"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {[
                            "",
                            "PENDING",
                            "APPROVED",
                            "REJECTED",
                            "SUSPENDED",
                        ].map((item) => (
                            <Button
                                key={item}
                                variant={
                                    status === item
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setStatus(item)}
                            >
                                {item || "ALL"}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vendors Table */}

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-slate-800">
                            <tr>
                                <th className="p-4 text-left">
                                    Store
                                </th>

                                <th className="p-4 text-left">
                                    Owner
                                </th>

                                <th className="p-4 text-left">
                                    Email
                                </th>

                                <th className="p-4 text-left">
                                    Status
                                </th>

                                <th className="p-4 text-left">
                                    Joined
                                </th>

                                <th className="p-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredVendors.map((vendor) => (
                                <tr
                                    key={vendor.id}
                                    className="border-b border-slate-800 hover:bg-slate-800/20"
                                >
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium">
                                                {vendor.storeName}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                ID: {vendor.id.slice(0, 8)}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div>
                                            <p>{vendor.user.name}</p>

                                            <p className="text-xs text-slate-500">
                                                Owner
                                            </p>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        {vendor.user.email}
                                    </td>

                                    <td className="p-4">
                                        <StatusBadge
                                            status={vendor.status}
                                        />
                                    </td>

                                    <td className="p-4">
                                        {new Date(
                                            vendor.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            {vendor.status ===
                                                "PENDING" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            disabled={isApproving}
                                                            onClick={() =>
                                                                approveVendor(
                                                                    vendor.id
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            disabled={isRejecting}
                                                            onClick={() =>
                                                                rejectVendor({
                                                                    id: vendor.id,
                                                                    reason:
                                                                        "Rejected by admin",
                                                                })
                                                            }
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}

                                            {vendor.status ===
                                                "APPROVED" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isSuspending}
                                                        onClick={() =>
                                                            suspendVendor(
                                                                vendor.id
                                                            )
                                                        }
                                                    >
                                                        Suspend
                                                    </Button>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredVendors.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-16 text-center text-slate-400"
                                    >
                                        No vendors found.
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