import { Prisma } from "@prisma/client";
import prisma from "../../config/prismaClient.js";
import { AppError } from "../../common/middlewares/errorMiddleware.js";
import { ProductStatus } from "@prisma/client";
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductQueryDTO,
  ProductListResult,
} from "./product.dto.js";
import { cache } from "../../config/redis.js";
import { logger } from "../../utils/logger.js";

// ─────────────────────────────────────────────────────────
// Cache helpers — version-counter strategy
//
// Instead of pattern-scanning Redis (not available in ICache interface),
// we keep a single `products:version` integer.  Every write increments it.
// Reads embed the version in the cache key → stale keys are never read.
// ─────────────────────────────────────────────────────────

const PRODUCTS_VERSION_KEY = "products:version";
const PRODUCTS_CACHE_TTL = 300; // 5 minutes

/**
 * Returns the current catalog version number (0 if not yet set).
 */
const getProductsVersion = async (): Promise<number> => {
  const v = await cache.get<number>(PRODUCTS_VERSION_KEY);
  return v ?? 0;
};

/**
 * Increments the version counter, effectively invalidating every
 * previously cached product-list result without needing key scanning.
 */
export const invalidateProductsCache = async (): Promise<void> => {
  const current = await getProductsVersion();
  const next = current + 1;
  // Keep the version key alive for a long time (24 h) so it survives TTL expiry
  await cache.set(PRODUCTS_VERSION_KEY, next, 86400);
  logger.debug(`[ProductsCache] Version bumped → v${next} (all list caches invalidated)`);
};

/**
 * Builds a deterministic, human-readable cache key from filter params
 * prefixed with the current version so stale data is never returned.
 */
const buildCacheKey = (version: number, filters: ProductQueryDTO): string => {
  const {
    page = 1,
    limit = 10,
    search = "",
    minPrice = "",
    maxPrice = "",
    categoryId = "",
    sortBy = "newest",
  } = filters;

  return `products:v${version}:p${page}:l${limit}:s${search}:min${minPrice}:max${maxPrice}:cat${categoryId}:sort${sortBy}`;
};

// ─────────────────────────────────────────────────────────
// Slug / vendor helpers
// ─────────────────────────────────────────────────────────

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

const ensureUniqueSlug = async (
  baseSlug: string,
  excludeProductId?: string
): Promise<string> => {
  let slug = baseSlug;
  const existingSlug = await prisma.product.findUnique({ where: { slug } });

  if (existingSlug && existingSlug.id !== excludeProductId) {
    slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }

  return slug;
};

// ─────────────────────────────────────────────────────────
// CRUD — each mutation invalidates the product-list cache
// ─────────────────────────────────────────────────────────

export const createProduct = async (userId: string, data: CreateProductDTO) => {
  const vendorId = await getVendorIdByUserId(userId);

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  }

  const slug = await ensureUniqueSlug(generateSlug(data.name));

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      images: data.images,
      status: ProductStatus.DRAFT,
      slug,
      vendorId,
    },
    include: {
      category: { select: { name: true } },
    },
  });

  // Invalidate product listing cache after new product is created
  await invalidateProductsCache();

  return product;
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
    throw new AppError(
      "You do not have permission to update this product.",
      403,
      "FORBIDDEN"
    );
  }

  const updateData: Prisma.ProductUpdateInput = { ...data };

  if (data.name) {
    const baseSlug = generateSlug(data.name);
    updateData.slug = await ensureUniqueSlug(baseSlug, productId);
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      category: { select: { name: true } },
    },
  });

  // Invalidate product listing cache after update
  await invalidateProductsCache();

  return product;
};

export const deleteProduct = async (
  productId: string,
  userId: string
): Promise<void> => {
  const vendorId = await getVendorIdByUserId(userId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { vendorId: true },
  });

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  if (product.vendorId !== vendorId) {
    throw new AppError(
      "You do not have permission to delete this product.",
      403,
      "FORBIDDEN"
    );
  }

  await prisma.product.delete({ where: { id: productId } });

  // Invalidate product listing cache after deletion
  await invalidateProductsCache();
};

// ─────────────────────────────────────────────────────────
// Read — single product (no caching needed, low traffic)
// ─────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────
// getAllProducts — Redis-cached product listing
// ─────────────────────────────────────────────────────────

export const getAllProducts = async (
  filters: ProductQueryDTO
): Promise<ProductListResult> => {
  // 1. Get current catalog version (version bump = all old keys become dead)
  const version = await getProductsVersion();
  const cacheKey = buildCacheKey(version, filters);

  // 2. Try cache hit first
  const cached = await cache.get<ProductListResult>(cacheKey);
  if (cached) {
    logger.debug(`[ProductsCache] HIT → ${cacheKey}`);
    return cached;
  }

  logger.debug(`[ProductsCache] MISS → ${cacheKey} — querying DB`);

  // 3. Cache miss: build Prisma query
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const { search, minPrice, maxPrice, categoryId, sortBy } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
  };

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
    if (minPrice !== undefined) (where.price as Prisma.DecimalFilter).gte = minPrice;
    if (maxPrice !== undefined) (where.price as Prisma.DecimalFilter).lte = maxPrice;
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

  const result: ProductListResult = {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  // 4. Store in cache for 5 minutes
  await cache.set(cacheKey, result, PRODUCTS_CACHE_TTL);
  logger.debug(`[ProductsCache] SET → ${cacheKey} (TTL: ${PRODUCTS_CACHE_TTL}s)`);

  return result;
};
