import { Prisma } from "@prisma/client";
import prisma from "../../config/prismaClient.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductQueryDTO,
  ProductListResult,
} from "./product.dto.js";

const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

const getVendorIdByUserId = async (userId: string): Promise<string> => {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!vendor) {
    throw new AppError("Vendor profile not found.", 404, "VENDOR_NOT_FOUND");
  }

  return vendor.id;
};

const ensureUniqueSlug = async (baseSlug: string, excludeProductId?: string): Promise<string> => {
  let slug = baseSlug;
  const existingSlug = await prisma.product.findUnique({ where: { slug } });

  if (existingSlug && existingSlug.id !== excludeProductId) {
    slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }

  return slug;
};

export const createProduct = async (userId: string, data: CreateProductDTO) => {
  const vendorId = await getVendorIdByUserId(userId);

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  }

  const slug = await ensureUniqueSlug(generateSlug(data.name));

  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      images: data.images,
      isActive: data.isActive ?? true,
      slug,
      vendorId,
    },
    include: {
      category: { select: { name: true } },
    },
  });
};

export const updateProduct = async (
  productId: string,
  userId: string,
  data: UpdateProductDTO
) => {
  const vendorId = await getVendorIdByUserId(userId);

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { vendorId: true, name: true },
  });

  if (!existing) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  if (existing.vendorId !== vendorId) {
    throw new AppError("You do not have permission to update this product.", 403, "FORBIDDEN");
  }

  const updateData: Prisma.ProductUpdateInput = { ...data };

  if (data.name) {
    const baseSlug = generateSlug(data.name);
    updateData.slug = await ensureUniqueSlug(baseSlug, productId);
  }

  return prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      category: { select: { name: true } },
    },
  });
};

export const deleteProduct = async (productId: string, userId: string): Promise<void> => {
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

export const getProductById = async (productId: string) => {
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

export const getVendorProducts = async (userId: string) => {
  const vendorId = await getVendorIdByUserId(userId);

  return prisma.product.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });
};

export const getAllProducts = async (filters: ProductQueryDTO): Promise<ProductListResult> => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const { search, minPrice, maxPrice, categoryId, sortBy } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  if (sortBy === "price_desc") orderBy = { price: "desc" };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };

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
