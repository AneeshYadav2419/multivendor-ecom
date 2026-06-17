export interface Coupon {
    id: string;
    code: string;
    description?: string;

    discountType:
    | "PERCENTAGE"
    | "FIXED";

    discountValue: number;

    minOrderAmount?: number;

    usageLimit?: number;

    usedCount: number;

    isActive: boolean;

    expiresAt?: string | null;

    createdAt: string;
}
