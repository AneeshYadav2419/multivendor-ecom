import prisma from "../config/prismaClient.js";
import { AppError } from "../middlewares/errorMiddleware.js";

/**
 * Helper to generate a URL-friendly slug from a string.
 */
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

/**
 * Helper to get vendorId for a given userId.
 * Throws error if user is not a vendor.
 */
const getVendorIdByUserId = async (userId: string) => {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!vendor) {
    throw new AppError("Vendor profile not found.", 404, "VENDOR_NOT_FOUND");
  }

  return vendor.id;
};

/**
 * Create a new product.
 */
export const createProductService = async (userId: string, data: any) => {
  const vendorId = await getVendorIdByUserId(userId);

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  }

  // Generate and handle slug uniqueness
  let slug = generateSlug(data.name);
  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  return await prisma.product.create({
    data: {
      ...data,
      slug,
      vendorId,
    },
    include: {
      category: { select: { name: true } },
    },
  });
};

/**
 * Update a product with ownership validation.
 */
export const updateProductService = async (productId: string, userId: string, data: any) => {
  const vendorId = await getVendorIdByUserId(userId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { vendorId: true },
  });

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  if (product.vendorId !== vendorId) {
    throw new AppError("You do not have permission to update this product.", 403, "FORBIDDEN");
  }

  // Handle slug if name is updated
  if (data.name) {
    data.slug = generateSlug(data.name);
    const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existingSlug && existingSlug.id !== productId) {
      data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }
  }

  return await prisma.product.update({
    where: { id: productId },
    data,
  });
};

/**
 * Delete a product with ownership validation.
 */
export const deleteProductService = async (productId: string, userId: string) => {
  const vendorId = await getVendorIdByUserId(userId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { vendorId: true },
  });

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  if (product.vendorId !== vendorId) {
    throw new AppError("You do not have permission to delete this product.", 403, "FORBIDDEN");
  }

  await prisma.product.delete({
    where: { id: productId },
  });
};

/**
 * Get single product by ID.
 */
export const getProductByIdService = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: { select: { name: true } },
      vendor: { select: { storeName: true, id: true } },
    },
  });

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  return product;
};

/**
 * Get all products belonging to the logged-in vendor.
 */
export const getVendorProductsService = async (userId: string) => {
  const vendorId = await getVendorIdByUserId(userId);

  return await prisma.product.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });
};

/**
 * Get all products with advanced filtering, search, and pagination.
 */
export const getAllProductsService = async (filters: any) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const { search, minPrice, maxPrice, categoryId, sortBy } = filters;
  
  const skip = (page - 1) * limit;


  // Build where clause
  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  // Build sorting
  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  if (sortBy === "price_desc") orderBy = { price: "desc" };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };

  // Execute count and findMany in parallel for performance
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: { select: { name: true } },
        vendor: { select: { storeName: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
