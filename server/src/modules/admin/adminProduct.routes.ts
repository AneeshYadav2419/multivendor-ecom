import { Router } from "express";
import {
    getPendingProducts,
    approveProduct,
    rejectProduct,
} from "./adminProduct.controller.js";

import {
    protect,
    restrictTo,
} from "../../common/middlewares/authMiddleware.js";

const router = Router();

router.use(
    protect,
    restrictTo("ADMIN")
);

router.get(
    "/pending",
    getPendingProducts
);

router.patch(
    "/:id/approve",
    approveProduct
);

router.patch(
    "/:id/reject",
    rejectProduct
);

export default router;