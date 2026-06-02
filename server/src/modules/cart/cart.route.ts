import { Router } from "express";
import { protect } from "../../common/middlewares/authMiddleware.js";
import * as  cartController from './cart.controller.js';
import { addToCartSchema, updateCartItemSchema } from "./cart.validation.js";
import { validate } from "../../common/middlewares/validateMiddleware.js";


const router = Router();

router.get(
  "/",
  protect,
  cartController.getCart
);

router.post(
  "/items",
  protect,
  validate(addToCartSchema),
  cartController.addToCart
);
export default router;