"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Coupon }
    from "../types/coupon.types";

import { useUpdateCoupon }
    from "../hooks/useUpdateCoupon";

interface Props {
    coupon: Coupon | null;
    open: boolean;
    onClose: () => void;
}

export default function EditCouponDialog({
    coupon,
    open,
    onClose,
}: Props) {
    const updateCoupon =
        useUpdateCoupon();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            code: "",
            description: "",
            discountValue: 0,
            usageLimit: 0,
        },
    });

    useEffect(() => {
        if (coupon) {
            reset({
                code: coupon.code,
                description:
                    coupon.description ?? "",
                discountValue:
                    coupon.discountValue,
                usageLimit:
                    coupon.usageLimit ?? 0,
            });
        }
    }, [coupon, reset]);

    // const onSubmit = async (
    //     values: any
    // ) => {
    //     if (!coupon) return;

    //     await updateCoupon.mutateAsync({
    //         id: coupon.id,
    //         data: values,
    //     });

    //     onClose();
    // };
    const onSubmit = async (
        values: any
    ) => {

        console.log(
            "FORM VALUES",
            values,
            typeof values.discountValue,
            typeof values.usageLimit
        );

        if (!coupon) return;

        await updateCoupon.mutateAsync({
            id: coupon.id,
            data: values,
        });

        onClose();
    };

    if (!open || !coupon)
        return null;

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center
                justify-center
                bg-black/60
                backdrop-blur-sm
            "
        >
            <div
                className="
                    w-full
                    max-w-xl
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-950
                    p-6
                "
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Edit Coupon
                    </h2>

                    <button
                        onClick={onClose}
                    >
                        <X
                            className="
                                h-5 w-5
                                text-slate-400
                            "
                        />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    className="space-y-4"
                >
                    <div>
                        <label
                            className="
                                mb-2 block
                                text-sm
                            "
                        >
                            Coupon Code
                        </label>

                        <input
                            {...register(
                                "code"
                            )}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-900
                                p-3
                            "
                        />
                    </div>

                    <div>
                        <label
                            className="
                                mb-2 block
                                text-sm
                            "
                        >
                            Description
                        </label>

                        <input
                            {...register(
                                "description"
                            )}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-700
                                bg-slate-900
                                p-3
                            "
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                className="
                                    mb-2 block
                                    text-sm
                                "
                            >
                                Discount %
                            </label>

                            <input
                                type="number"
                                {...register(
                                    "discountValue", {
                                    valueAsNumber: true,
                                }
                                )}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-slate-900
                                    p-3
                                "
                            />
                        </div>

                        <div>
                            <label
                                className="
                                    mb-2 block
                                    text-sm
                                "
                            >
                                Usage Limit
                            </label>

                            <input
                                type="number"
                                {...register(
                                    "usageLimit", {
                                    valueAsNumber: true,
                                }
                                )}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-slate-900
                                    p-3
                                "
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            updateCoupon.isPending
                        }
                        className="
                            w-full
                            rounded-xl
                            bg-indigo-600
                            px-4
                            py-3
                            font-medium
                            hover:bg-indigo-500
                        "
                    >
                        {
                            updateCoupon.isPending
                                ? "Saving..."
                                : "Save Changes"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}