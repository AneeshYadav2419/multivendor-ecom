// "use client";

// import CouponsTable
//     from "@/features/coupons/components/CouponsTable";
// import CreateCouponDialog from "@/features/coupons/components/CreateCouponDialog";

// import { useCoupons }
//     from "@/features/coupons/hooks/useCoupons";

// export default function CouponsPage() {
//     const {
//         data,
//         isLoading,
//     } = useCoupons();

//     if (isLoading) {
//         return (
//             <div className="p-6">
//                 Loading...
//             </div>
//         );
//     }

//     return (
//         <div className="flex items-center justify-between">
//             <div>
//                 <h1 className="text-3xl font-bold">
//                     Coupons
//                 </h1>

//                 <p className="text-slate-400">
//                     Manage discount coupons
//                 </p>
//             </div>

//             <CreateCouponDialog />
//         </div>
//     );
// }
"use client";
import { useState } from "react";

import EditCouponDialog
    from "@/features/coupons/components/EditCouponDialog";

import { Coupon }
    from "@/features/coupons/types/coupon.types";

import CouponsTable
    from "@/features/coupons/components/CouponsTable";

import CreateCouponDialog
    from "@/features/coupons/components/CreateCouponDialog";

import { useCoupons }
    from "@/features/coupons/hooks/useCoupons";

export default function CouponsPage() {
    const [selectedCoupon, setSelectedCoupon] =
        useState<Coupon | null>(null);

    const [isEditOpen, setIsEditOpen] =
        useState(false);

    const handleEdit = (
        coupon: Coupon
    ) => {
        setSelectedCoupon(coupon);
        setIsEditOpen(true);
    };
    const {
        data,
        isLoading,
    } = useCoupons();

    if (isLoading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Coupons
                    </h1>

                    <p className="text-slate-400">
                        Manage discount coupons
                    </p>
                </div>

                <CreateCouponDialog />
            </div>
            <CouponsTable
                coupons={data ?? []}
                onEdit={handleEdit}
            />
            <EditCouponDialog
                coupon={selectedCoupon}
                open={isEditOpen}
                onClose={() =>
                    setIsEditOpen(false)
                }
            />

        </div>
    );
}