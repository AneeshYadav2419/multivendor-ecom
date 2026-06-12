export interface CreateCouponDto {
    code: string;
    description?: string;

    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;

    minOrderAmount?: number;

    usageLimit?: number;

    startsAt?: Date;
    // expiresAt?: Date;
    expiresAt?: string;
}