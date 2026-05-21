import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./product.validation.js";

export type CreateProductDTO = z.infer<typeof createProductSchema>["body"];
export type UpdateProductDTO = z.infer<typeof updateProductSchema>["body"];
export type ProductQueryDTO = z.infer<typeof productQuerySchema>["query"];

export interface ProductPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ProductListItem = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true } };
    vendor: { select: { storeName: true } };
  };
}>;

export interface ProductListResult {
  products: ProductListItem[];
  pagination: ProductPaginationMeta;
}
