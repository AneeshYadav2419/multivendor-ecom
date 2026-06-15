import { PaymentMethod } from "@prisma/client";

export interface PlaceOrderInput {
    shippingName: string;
    shippingPhone: string;

    addressLine1: string;
    addressLine2?: string;

    city: string;
    state: string;
    country: string;
    pincode: string;

    paymentMethod: PaymentMethod;
    couponCode?: string;
}