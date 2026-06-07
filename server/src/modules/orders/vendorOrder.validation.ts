

import { z } from "zod";

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.enum([
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ]),
    }),
});