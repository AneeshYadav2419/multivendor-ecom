import { Router } from "express";
import { protect } from "../../common/middlewares/authMiddleware.js";
import * as wishlistController from "./wishlist.controller.js";
import { mergeWishlistSchema, toggleWishlistSchema } from "./wishlist.validation.js";
import { validate } from "../../common/middlewares/validateMiddleware.js";

const router = Router();

router.get(
    "/",
    protect,
    wishlistController.getWishlist
);

router.post(
    "/toggle",
    protect,
    validate(toggleWishlistSchema),
    wishlistController.toggleWishlistItem
);

router.post(
    "/merge",
    protect,
    validate(mergeWishlistSchema),
    wishlistController.mergeWishlist
);
router.delete(
    "/:productId",
    protect,
    wishlistController.removeWishlistItem
);

export default router;