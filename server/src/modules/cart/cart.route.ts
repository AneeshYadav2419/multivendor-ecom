// import { Router } from "express";
// import { protect } from "../../common/middlewares/authMiddleware.js";
// import * as  cartController from './cart.controller.js';
// import { addToCartSchema, updateCartItemSchema } from "./cart.validation.js";
// import { validate } from "../../common/middlewares/validateMiddleware.js";


// const router = Router();

// router.get(
//   "/",
//   protect,
//   cartController.getCart
// );

// router.post(
//   "/items",
//   protect,
//   validate(addToCartSchema),
//   cartController.addToCart
// );
// export default router;
import { Router } from "express";
import { protect } from "../../common/middlewares/authMiddleware.js";
import * as cartController from "./cart.controller.js";
import { addToCartSchema, updateCartItemSchema } from "./cart.validation.js";
import { validate } from "../../common/middlewares/validateMiddleware.js";

const router = Router();

router.get(
  "/",
  protect,
  cartController.getCart
);

router.post(
  "/add",
  protect,
  validate(addToCartSchema),
  cartController.addToCart
);

router.patch(
  "/item/:itemId",
  protect,
  validate(updateCartItemSchema),
  cartController.updateCartItem
);

router.delete(
  "/item/:itemId",
  protect,
  cartController.removeCartItem
);

router.delete(
  "/clear",
  protect,
  cartController.clearCart
);

export default router;