import { Request, Response, NextFunction } from "express";
import * as productService from "../services/productService.js";

/**
 * Create a new product.
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProductService(req.user!.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a product.
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id as string;
    const product = await productService.updateProductService(
      productId,
      req.user!.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product.
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id as string;
    await productService.deleteProductService(productId, req.user!.userId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID.
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id as string;
    const product = await productService.getProductByIdService(productId);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products for the logged-in vendor.
 */
export const getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getVendorProductsService(req.user!.userId);

    res.status(200).json({
      success: true,
      results: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products with filtering and pagination.
 */
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { products, pagination } = await productService.getAllProductsService(req.query);

    res.status(200).json({
      success: true,
      results: products.length,
      pagination,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
