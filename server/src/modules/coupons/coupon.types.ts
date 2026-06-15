export interface CreateCouponDto {
    code: string;
    description?: string;

    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;

    minOrderAmount?: number;

    usageLimit?: number;

    // startsAt?: Date;
    // // expiresAt?: Date;
    // // expiresAt?: string;
    // expiresAt?: Date | null;
    startsAt?: string | Date | null;
    expiresAt?: string | Date | null;
}

export interface UpdateCouponDto {
    code?: string;
    description?: string;
    discountType?: "PERCENTAGE" | "FIXED";
    discountValue?: number;
    minOrderAmount?: number;
    usageLimit?: number;
    // startsAt?: Date | null;
    // expiresAt?: Date | null;
    startsAt?: string | Date | null;
    expiresAt?: string | Date | null;
    isActive?: boolean;
}