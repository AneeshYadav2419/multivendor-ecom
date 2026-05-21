import { Request, Response } from "express";
import * as productService from "./product.service.js";
import { CreateProductDTO, UpdateProductDTO, ProductQueryDTO } from "./product.dto.js";
import { serializeProduct, serializeProducts } from "./product.serializer.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const dto: CreateProductDTO = req.body;
  const product = await productService.createProduct(req.user!.userId, dto);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: serializeProduct(product),
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const dto: UpdateProductDTO = req.body;
  const product = await productService.updateProduct(productId, req.user!.userId, dto);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: serializeProduct(product),
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  await productService.deleteProduct(productId, req.user!.userId);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const product = await productService.getProductById(productId);

  res.status(200).json({
    success: true,
    data: serializeProduct(product),
  });
});

export const getMyProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await productService.getVendorProducts(req.user!.userId);

  res.status(200).json({
    success: true,
    results: products.length,
    data: serializeProducts(products),
  });
});

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = (req.validatedQuery ?? req.query) as unknown as ProductQueryDTO;
  const { products, pagination } = await productService.getAllProducts(filters);

  res.status(200).json({
    success: true,
    results: products.length,
    pagination,
    data: serializeProducts(products),
  });
});
