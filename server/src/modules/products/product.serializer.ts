import { Decimal } from "@prisma/client/runtime/client";

/** Prisma Decimal → JSON-safe number for API responses */
const toNumber = (value: Decimal | number | string): number => {
  if (value instanceof Decimal) {
    return value.toNumber();
  }
  if (typeof value === "string") {
    return parseFloat(value);
  }
  return value;
};

type ProductLike = {
  price: Decimal | number | string;
  [key: string]: unknown;
};

export const serializeProduct = <T extends ProductLike>(product: T) => ({
  ...product,
  price: toNumber(product.price),
});

export const serializeProducts = <T extends ProductLike>(products: T[]) =>
  products.map(serializeProduct);
