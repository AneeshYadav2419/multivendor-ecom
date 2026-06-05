// client/src/features/admin/hooks/use-admin-vendors.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllVendors,
    getPendingVendors,
    approveVendor,
    rejectVendor,
    suspendVendor,
    updateVendorStatus,
} from "@/lib/api/admin";
import { toast } from "sonner";
import type { AdminVendorListResponse } from "@/features/admin/types";

export const useAdminVendors = (status?: string) => {
    const queryClient = useQueryClient();

    // 1. Fetching all vendors (with optional status filter)
    const vendorsQuery = useQuery<AdminVendorListResponse, Error>({
        queryKey: status ? ["admin", "vendors", { status }] : ["admin", "vendors", "all"],
        queryFn: () => getAllVendors(status),
    });

    // 2. Separate query for dedicated /admin/pending endpoint
    const pendingVendorsQuery = useQuery<AdminVendorListResponse, Error>({
        queryKey: ["admin", "vendors", "pending"],
        queryFn: getPendingVendors,
    });

    // 3. Mutation: Approve Vendor
    const approveVendorMutation = useMutation({
        mutationFn: (id: string) => approveVendor(id),
        onSuccess: () => {
            toast.success("Vendor Approved");

            // Invalidate vendor lists and dashboard counts
            queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });

    // 4. Mutation: Reject Vendor with optional reason
    const rejectVendorMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            rejectVendor(id, reason),
        onSuccess: () => {
            toast.success("Vendor Rejected");

            queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });

    // 5. Mutation: Suspend Vendor
    const suspendVendorMutation = useMutation({
        mutationFn: (id: string) => suspendVendor(id),
        onSuccess: () => {
            toast.success("Vendor Suspended");
            queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
        },
    });

    // 6. Mutation: Direct Vendor Status Override
    const updateStatusMutation = useMutation({
        mutationFn: ({ vendorId, status }: { vendorId: string; status: string }) =>
            updateVendorStatus(vendorId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        },
    });

    return {
        // Queries Data
        vendorsData: vendorsQuery.data,
        pendingVendorsData: pendingVendorsQuery.data,

        // Status Flags
        isLoadingVendors: vendorsQuery.isLoading,
        isLoadingPending: pendingVendorsQuery.isLoading,
        isError: vendorsQuery.isError || pendingVendorsQuery.isError,
        error: vendorsQuery.error || pendingVendorsQuery.error,

        // Action Mutations
        approveVendor: approveVendorMutation.mutateAsync,
        rejectVendor: rejectVendorMutation.mutateAsync,
        suspendVendor: suspendVendorMutation.mutateAsync,
        updateVendorStatus: updateStatusMutation.mutateAsync,

        // Mutation Loading States (Optional, helpful for loading spinners on buttons)
        isApproving: approveVendorMutation.isPending,
        isRejecting: rejectVendorMutation.isPending,
        isSuspending: suspendVendorMutation.isPending,
        isUpdatingStatus: updateStatusMutation.isPending,
    };
};