import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/categoryService.js";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategoryService(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const category = await categoryService.updateCategoryService(id, req.body);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await categoryService.deleteCategoryService(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategoriesService();
    res.status(200).json({
      success: true,
      results: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const category = await categoryService.getCategoryByIdService(id);
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
