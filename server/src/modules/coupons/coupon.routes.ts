import { Router } from "express";

import * as couponController
    from "./coupon.controller.js";

import {
    protect,
    restrictTo,
}
    from "../../common/middlewares/authMiddleware.js";

const router = Router();

router.get(
    "/",
    protect,
    restrictTo("ADMIN"),
    couponController.getCoupons
);

router.post(
    "/",
    protect,
    restrictTo("ADMIN"),
    couponController.createCoupon
);

router.patch(
    "/:id",
    protect,
    restrictTo("ADMIN"),
    couponController.updateCoupon
);
router.patch(
    "/:id/status",
    couponController.toggleCouponStatus
);

router.delete(
    "/:id",
    couponController.deleteCoupon
);
export default router;