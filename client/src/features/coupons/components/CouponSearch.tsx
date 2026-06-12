"use client";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function CouponSearch({
    value,
    onChange,
}: Props) {
    return (
        <input
            value={value}
            onChange={(e) =>
                onChange(e.target.value)
            }
            placeholder="Search coupon code..."
            className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-4
                py-3
                outline-none
                focus:border-indigo-500
            "
        />
    );
}