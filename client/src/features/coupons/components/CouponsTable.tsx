// import { useToggleCoupon } from "../hooks/toggleCoupons";
// import { Coupon }
//     from "../types/coupon.types";
// import { Pencil } from "lucide-react";

// interface Props {
//     coupons: Coupon[];
//     onEdit: (coupon: Coupon) => void;
// }


// export default function CouponsTable({
//     coupons,
//     onEdit,
// }: Props) {
//     const toggleCoupon =
//         useToggleCoupon();
//     return (
//         <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
//             <table className="w-full">
//                 <thead>
//                     <tr className="border-b border-slate-800 text-left">
//                         <th className="p-4">
//                             Code
//                         </th>

//                         <th className="p-4">
//                             Discount
//                         </th>

//                         <th className="p-4">
//                             Usage
//                         </th>

//                         <th className="p-4">
//                             Status
//                         </th>

//                         <th className="p-4">
//                             Expiry
//                         </th>
//                         <th className="p-4 text-right">
//                             Actions
//                         </th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {coupons.map((coupon) => (
//                         <tr
//                             key={coupon.id}
//                             className="border-b border-slate-800"
//                         >
//                             <td className="p-4 font-medium">
//                                 {coupon.code}
//                             </td>

//                             <td className="p-4">
//                                 {coupon.discountType ===
//                                     "PERCENTAGE"
//                                     ? `${coupon.discountValue}%`
//                                     : `₹${coupon.discountValue}`}
//                             </td>

//                             <td className="p-4">
//                                 {coupon.usedCount}/
//                                 {coupon.usageLimit ??
//                                     "∞"}
//                             </td>

//                             <td className="p-4">
//                                 {/* <span
//                                     className={`rounded-full px-3 py-1 text-xs font-medium ${coupon.isActive
//                                         ? "bg-emerald-500/20 text-emerald-400"
//                                         : "bg-red-500/20 text-red-400"
//                                         }`}
//                                 >
//                                     {coupon.isActive
//                                         ? "Active"
//                                         : "Inactive"}
//                                 </span> */}
//                                 <button
//                                     onClick={() =>
//                                         useToggleCoupon.mutate({
//                                             id: coupon.id,
//                                             isActive:
//                                                 !coupon.isActive,
//                                         })
//                                     }
//                                     className={`
//         rounded-full
//         px-3
//         py-1
//         text-xs
//         font-medium
//         transition
//         ${coupon.isActive
//                                             ? "bg-emerald-500/20 text-emerald-400"
//                                             : "bg-red-500/20 text-red-400"
//                                         }
//     `}
//                                 >
//                                     {coupon.isActive
//                                         ? "Active"
//                                         : "Inactive"}
//                                 </button>
//                             </td>

//                             <td className="p-4">
//                                 {coupon.expiresAt
//                                     ? new Date(
//                                         coupon.expiresAt
//                                     ).toLocaleDateString()
//                                     : "-"}
//                             </td>
//                             <td className="p-4 text-right">
//                                 <button
//                                     onClick={() => onEdit(coupon)}

//                                     className="
//         inline-flex
//         items-center
//         gap-2
//         rounded-lg
//         border
//         border-slate-700
//         px-3
//         py-2
//         text-sm
//         hover:bg-slate-800
//         transition-all
//     "
//                                 >
//                                     <Pencil className="h-4 w-4" />
//                                     Edit
//                                 </button>
//                             </td>

//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
"use client";

import { Pencil, Trash2 } from "lucide-react";

import { useToggleCoupon }
    from "../hooks/toggleCoupons";

import { Coupon }
    from "../types/coupon.types";
import { useDeleteCoupon }
    from "../hooks/useDeleteCoupon";


interface Props {
    coupons: Coupon[];
    onEdit: (coupon: Coupon) => void;
}

export default function CouponsTable({
    coupons,
    onEdit,
}: Props) {

    const toggleCoupon =
        useToggleCoupon();
    const deleteCoupon =
        useDeleteCoupon();

    return (
        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/50
            "
        >
            <table className="w-full">
                <thead>
                    <tr
                        className="
                            border-b
                            border-slate-800
                            text-left
                        "
                    >
                        <th className="p-4">
                            Code
                        </th>

                        <th className="p-4">
                            Discount
                        </th>

                        <th className="p-4">
                            Usage
                        </th>

                        <th className="p-4">
                            Status
                        </th>

                        <th className="p-4">
                            Expiry
                        </th>

                        <th className="p-4 text-right">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {coupons.map((coupon) => (
                        <tr
                            key={coupon.id}
                            className="
                                border-b
                                border-slate-800
                                hover:bg-slate-800/30
                                transition-colors
                            "
                        >
                            <td className="p-4 font-medium">
                                {coupon.code}
                            </td>

                            <td className="p-4">
                                {coupon.discountType ===
                                    "PERCENTAGE"
                                    ? `${coupon.discountValue}%`
                                    : `₹${coupon.discountValue}`}
                            </td>

                            <td className="p-4">
                                {coupon.usedCount}/
                                {coupon.usageLimit ??
                                    "∞"}
                            </td>

                            <td className="p-4">
                                <button
                                    onClick={() =>
                                        toggleCoupon.mutate({
                                            id: coupon.id,
                                            isActive:
                                                !coupon.isActive,
                                        })
                                    }
                                    disabled={
                                        toggleCoupon.isPending
                                    }
                                    className={`
                                        rounded-full
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        transition-all
                                        hover:scale-105
                                        ${coupon.isActive
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-red-500/20 text-red-400"
                                        }
                                    `}
                                >
                                    {coupon.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </button>
                            </td>

                            <td className="p-4">
                                {coupon.expiresAt
                                    ? new Date(
                                        coupon.expiresAt
                                    ).toLocaleDateString()
                                    : "-"}
                            </td>

                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">

                                    <button
                                        onClick={() =>
                                            onEdit(coupon)
                                        }
                                        className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-slate-700
                px-3
                py-2
                text-sm
                hover:bg-slate-800
            "
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => {

                                            const confirmed =
                                                window.confirm(
                                                    `Delete ${coupon.code}?`
                                                );

                                            if (!confirmed)
                                                return;

                                            deleteCoupon.mutate(
                                                coupon.id
                                            );
                                        }}
                                        className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-red-500/30
                bg-red-500/10
                px-3
                py-2
                text-sm
                text-red-400
                hover:bg-red-500/20
            "
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {coupons.length === 0 && (
                <div
                    className="
                        py-12
                        text-center
                        text-slate-400
                    "
                >
                    No coupons found
                </div>
            )}
        </div>
    );
}