"use client";

import { Coupon } from "../types/coupon.types";
import {
    Ticket,
    CheckCircle2,
    XCircle,
    TrendingUp,
} from "lucide-react";

interface Props {
    coupons: Coupon[];
}

export default function CouponStats({
    coupons,
}: Props) {

    const totalCoupons =
        coupons.length;

    const activeCoupons =
        coupons.filter(
            (coupon) => coupon.isActive
        ).length;

    const inactiveCoupons =
        totalCoupons -
        activeCoupons;

    const totalUsage =
        coupons.reduce(
            (acc, coupon) =>
                acc + coupon.usedCount,
            0
        );

    const stats = [
        {
            title: "Total Coupons",
            value: totalCoupons,
            icon: Ticket,
        },
        {
            title: "Active Coupons",
            value: activeCoupons,
            icon: CheckCircle2,
        },
        {
            title: "Inactive Coupons",
            value: inactiveCoupons,
            icon: XCircle,
        },
        {
            title: "Total Uses",
            value: totalUsage,
            icon: TrendingUp,
        },
    ];

    return (
        <div
            className="
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.title}
                        className="
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-900/50
                            p-5
                            backdrop-blur
                            transition-all
                            hover:border-indigo-500/30
                            hover:bg-slate-900
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-sm
                                        text-slate-400
                                    "
                                >
                                    {stat.title}
                                </p>

                                <h2
                                    className="
                                        mt-3
                                        text-3xl
                                        font-bold
                                    "
                                >
                                    {stat.value}
                                </h2>
                            </div>

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-slate-800
                                    bg-slate-950
                                    p-3
                                "
                            >
                                <Icon
                                    className="
                                        h-6
                                        w-6
                                        text-indigo-400
                                    "
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}