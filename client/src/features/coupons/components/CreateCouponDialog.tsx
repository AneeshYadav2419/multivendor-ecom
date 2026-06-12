"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import CouponForm, {
    CouponFormValues,
} from "./CouponForm";

import { useCreateCoupon }
    from "../hooks/useCreateCoupon";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button }
    from "@/components/ui/button";

export default function CreateCouponDialog() {
    const [open, setOpen] =
        useState(false);

    const createCoupon =
        useCreateCoupon();

    const handleSubmit = async (
        values: CouponFormValues
    ) => {
        try {
            await createCoupon.mutateAsync(
                values
            );

            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Coupon
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl border-slate-800 bg-slate-950">
                <DialogHeader>
                    <DialogTitle>
                        Create Coupon
                    </DialogTitle>

                    <DialogDescription>
                        Create discount
                        coupons for your
                        customers.
                    </DialogDescription>
                </DialogHeader>

                <CouponForm
                    onSubmit={
                        handleSubmit
                    }
                    isLoading={
                        createCoupon.isPending
                    }
                />
            </DialogContent>
        </Dialog>
    );
}