"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export const couponSchema = z.object({
  code: z.string().min(1),

  description: z.string().optional(),

  discountType: z.enum(["PERCENTAGE", "FIXED"]),

  discountValue: z.coerce.number(),

  minOrderAmount: z.coerce.number().optional(),

  usageLimit: z.coerce.number().optional(),

  expiresAt: z.string().optional(),
});

export type CouponFormValues =
    z.infer<typeof couponSchema>;

interface Props {
    onSubmit: (
        values: CouponFormValues
    ) => void;

    isLoading?: boolean;
}

export default function CouponForm({
    onSubmit,
    isLoading = false,
}: Props) {
 const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<CouponFormValues>({
  resolver: zodResolver(couponSchema) as Resolver<CouponFormValues>,
  defaultValues: {
    discountType: "PERCENTAGE",
  },
});

    return (
        <form
            onSubmit={handleSubmit(
                onSubmit
            )}
            className="space-y-6"
        >
            {/* Coupon Code */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Coupon Code
                </label>

                <Input
                    placeholder="WELCOME10"
                    {...register("code")}
                />

                {errors.code && (
                    <p className="text-sm text-red-500">
                        {
                            errors.code
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Description */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Description
                </label>

                <Input
                    placeholder="Welcome Offer"
                    {...register(
                        "description"
                    )}
                />
            </div>

            {/* Grid */}

            <div className="grid gap-4 md:grid-cols-2">
                {/* Type */}

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Discount Type
                    </label>

                    <select
                        {...register(
                            "discountType"
                        )}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                    >
                        <option value="PERCENTAGE">
                            Percentage
                        </option>

                        <option value="FIXED">
                            Fixed Amount
                        </option>
                    </select>
                </div>

                {/* Value */}

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Discount Value
                    </label>

                    <Input
                        type="number"
                        placeholder="10"
                        {...register(
                            "discountValue"
                        )}
                    />

                    {errors.discountValue && (
                        <p className="text-sm text-red-500">
                            {
                                errors
                                    .discountValue
                                    .message
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* Grid */}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Minimum Order Amount
                    </label>

                    <Input
                        type="number"
                        placeholder="500"
                        {...register(
                            "minOrderAmount"
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Usage Limit
                    </label>

                    <Input
                        type="number"
                        placeholder="100"
                        {...register(
                            "usageLimit"
                        )}
                    />
                </div>
            </div>

            {/* Expiry */}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Expiry Date
                </label>

                <Input
                    type="date"
                    {...register(
                        "expiresAt"
                    )}
                />
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[140px]"
                >
                    {isLoading
                        ? "Creating..."
                        : "Create Coupon"}
                </Button>
            </div>
        </form>
    );
}