// // src/features/admin/hooks/use-admin-product-actions.ts

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";

// import {
//     approveProduct,
//     rejectProduct,
// } from "@/lib/api/admin";

// export const useAdminProductActions = () => {
//     const queryClient = useQueryClient();

//     const invalidate = () => {
//         queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
//         queryClient.invalidateQueries({ queryKey: ["admin", "products", "pending"] });
//         queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
//     };

//     const approveMutation = useMutation({
//         mutationFn: (id: string) => approveProduct(id),

//         onSuccess: () => {
//             toast.success("Product approved");
//             invalidate();
//         },

//         onError: (err: any) => {
//             toast.error(err?.response?.data?.message || "Failed to approve product");
//         },
//     });

//     const rejectMutation = useMutation({
//         mutationFn: (id: string) => rejectProduct(id),

//         onSuccess: () => {
//             toast.success("Product rejected");
//             invalidate();
//         },

//         onError: (err: any) => {
//             toast.error(err?.response?.data?.message || "Failed to reject product");
//         },
//     });

//     return {
//         approveProduct: approveMutation.mutateAsync,
//         rejectProduct: rejectMutation.mutateAsync,

//         isApproving: approveMutation.isPending,
//         isRejecting: rejectMutation.isPending,
//     };
// };
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    approveProduct,
    rejectProduct,
} from "@/lib/api/products.api";

export const useAdminProductActions = () => {
    const queryClient = useQueryClient();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "products", "pending"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    };

    const approveMutation = useMutation({
        mutationFn: (id: string) => approveProduct(id),

        onSuccess: () => {
            toast.success("Product approved");
            invalidate();
        },

        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Approval failed");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => rejectProduct(id),

        onSuccess: () => {
            toast.success("Product rejected");
            invalidate();
        },

        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Rejection failed");
        },
    });

    return {
        approveProduct: approveMutation.mutateAsync,
        rejectProduct: rejectMutation.mutateAsync,

        isApproving: approveMutation.isPending,
        isRejecting: rejectMutation.isPending,
    };
};