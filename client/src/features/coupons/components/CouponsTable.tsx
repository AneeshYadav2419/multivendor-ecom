import { Coupon }
    from "../types/coupon.types";
import { Pencil } from "lucide-react";

interface Props {
    coupons: Coupon[];
    onEdit: (coupon: Coupon) => void;
}

export default function CouponsTable({
    coupons,
    onEdit,
}: Props) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-800 text-left">
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
                            className="border-b border-slate-800"
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
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${coupon.isActive
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/20 text-red-400"
                                        }`}
                                >
                                    {coupon.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </td>

                            <td className="p-4">
                                {coupon.expiresAt
                                    ? new Date(
                                        coupon.expiresAt
                                    ).toLocaleDateString()
                                    : "-"}
                            </td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => onEdit(coupon)}

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
        transition-all
    "
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}