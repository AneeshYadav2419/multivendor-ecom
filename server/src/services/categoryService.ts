import prisma from "../config/prismaClient.js";
import { AppError } from "../common/middlewares/errorMiddleware.js";

/**
 * Helper to generate a URL-friendly slug.
 */
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

/**
 * Create a new category.
 * Only Admins should trigger this via the controller.
 */
export const createCategoryService = async (data: { name: string; description?: string }) => {
  const slug = generateSlug(data.name);

  // Check if name or slug already exists
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: data.name }, { slug }],
    },
  });

  if (existing) {
    throw new AppError("Category with this name already exists.", 409, "DUPLICATE_CATEGORY");
  }

  return await prisma.category.create({
    data: {
      ...data,
      slug,
    },
  });
};

/**
 * Update an existing category.
 */
export const updateCategoryService = async (id: string, data: { name?: string; description?: string }) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError("Category not found.", 404, "NOT_FOUND");
  }

  if (data.name) {
    const slug = generateSlug(data.name);
    // Check if new name/slug collides with another category
    const collision = await prisma.category.findFirst({
      where: {
        AND: [
          { OR: [{ name: data.name }, { slug }] },
          { id: { not: id } }
        ]
      },
    });

    if (collision) {
      throw new AppError("Another category already has this name.", 409, "DUPLICATE_CATEGORY");
    }
    
    (data as any).slug = slug;
  }

  return await prisma.category.update({
    where: { id },
    data,
  });
};

/**
 * Delete a category.
 */
export const deleteCategoryService = async (id: string) => {
  // Check if category has products before deleting (optional business rule)
  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    throw new AppError("Cannot delete category that contains products.", 400, "CATEGORY_NOT_EMPTY");
  }

  await prisma.category.delete({ where: { id } });
};

/**
 * Get all categories.
 */
export const getAllCategoriesService = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

/**
 * Get single category by ID.
 */
export const getCategoryByIdService = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError("Category not found.", 404, "NOT_FOUND");
  }
  return category;
};
