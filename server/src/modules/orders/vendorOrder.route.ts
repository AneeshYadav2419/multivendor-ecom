import { Router } from "express";

import {
    protect,
    restrictTo,
} from "../../common/middlewares/authMiddleware.js";
import * as controller from "./vendorOrder.controller.js";

import { validate } from "../../common/middlewares/validateMiddleware.js";

import {
    updateOrderStatusSchema,
} from "./vendorOrder.validation.js";

const router = Router();

router.use(
    protect,
    restrictTo("VENDOR")
);

router.get(
    "/",
    controller.getVendorOrders
);

router.get(
    "/:id",
    controller.getVendorOrderById
);

router.patch(
    "/:id/status",
    validate(updateOrderStatusSchema),
    controller.updateOrderStatus
);

export default router;