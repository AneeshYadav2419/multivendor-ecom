import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BCRYPT_ROUNDS = 12;
const DEMO_PASSWORD = "Demo@12345";

const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

async function main() {
  console.log("🌱 Seeding AuraMarket database...");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);

  // ── Admin ──
  const admin = await prisma.user.upsert({
    where: { email: "admin@auramarket.com" },
    update: {},
    create: {
      name: "Aura Admin",
      email: "admin@auramarket.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  // ── Approved vendor ──
  const vendorUser = await prisma.user.upsert({
    where: { email: "vendor@auramarket.com" },
    update: {},
    create: {
      name: "Tech Haven Vendor",
      email: "vendor@auramarket.com",
      password: passwordHash,
      role: "VENDOR",
      vendor: {
        create: {
          storeName: "Tech Haven",
          description: "Premium electronics and accessories for modern living.",
          status: "APPROVED",
        },
      },
    },
    include: { vendor: true },
  });

  let vendor = vendorUser.vendor;
  if (!vendor) {
    vendor = await prisma.vendor.upsert({
      where: { userId: vendorUser.id },
      update: { status: "APPROVED" },
      create: {
        userId: vendorUser.id,
        storeName: "Tech Haven",
        description: "Premium electronics and accessories.",
        status: "APPROVED",
      },
    });
  } else if (vendor.status !== "APPROVED") {
    vendor = await prisma.vendor.update({
      where: { id: vendor.id },
      data: { status: "APPROVED" },
    });
  }

  // ── Demo customer ──
  await prisma.user.upsert({
    where: { email: "customer@auramarket.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@auramarket.com",
      password: passwordHash,
      role: "CUSTOMER",
    },
  });

  // ── Categories ──
  const categoryData = [
    { name: "Electronics", description: "Gadgets, audio, and smart devices" },
    { name: "Fashion", description: "Clothing and lifestyle wear" },
    { name: "Home & Living", description: "Furniture and decor essentials" },
  ];

  const categories: Record<string, { id: string; name: string }> = {};

  for (const cat of categoryData) {
    const slug = generateSlug(cat.name);
    const record = await prisma.category.upsert({
      where: { slug },
      update: { description: cat.description },
      create: {
        name: cat.name,
        slug,
        description: cat.description,
      },
    });
    categories[cat.name] = record;
  }

  // ── Products (public catalog) ──
  const products = [
    {
      name: "Wireless Noise-Cancelling Headphones",
      description:
        "Premium over-ear headphones with 40-hour battery life, active noise cancellation, and studio-quality sound for work and travel.",
      price: 7999,
      stock: 45,
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      ],
    },
    {
      name: "Mechanical Keyboard Pro",
      description:
        "Hot-swappable mechanical keyboard with RGB backlight, PBT keycaps, and tactile switches built for developers and gamers.",
      price: 5499,
      stock: 30,
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1511467687858-23d96c43e13a?w=800&q=80",
      ],
    },
    {
      name: "Smart Watch Series X",
      description:
        "Track fitness, heart rate, and sleep with a bright AMOLED display and 7-day battery in a lightweight aluminum frame.",
      price: 12999,
      stock: 22,
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      ],
    },
    {
      name: "Minimalist Leather Jacket",
      description:
        "Hand-finished genuine leather jacket with modern slim fit. Perfect for transitional seasons and evening wear.",
      price: 18999,
      stock: 12,
      category: "Fashion",
      images: [
        "https://images.unsplash.com/photo-1551028713-0b4c967ca6bc?w=800&q=80",
      ],
    },
    {
      name: "Organic Cotton Hoodie",
      description:
        "Ultra-soft organic cotton hoodie with reinforced stitching. Available in neutral tones for everyday comfort.",
      price: 3499,
      stock: 80,
      category: "Fashion",
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      ],
    },
    {
      name: "Ceramic Table Lamp",
      description:
        "Scandinavian-inspired ceramic lamp with warm dimmable LED glow. Ideal for bedside tables and reading nooks.",
      price: 2999,
      stock: 35,
      category: "Home & Living",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      ],
    },
    {
      name: "Ergonomic Office Chair",
      description:
        "Adjustable lumbar support, breathable mesh back, and smooth-rolling casters for all-day productivity at your desk.",
      price: 22499,
      stock: 8,
      category: "Home & Living",
      images: [
        "https://images.unsplash.com/photo-1580480059633-28bcdc7a3652?w=800&q=80",
      ],
    },
    {
      name: "Portable Bluetooth Speaker",
      description:
        "Water-resistant portable speaker with 360° sound, deep bass, and 18-hour playtime for outdoor adventures.",
      price: 4299,
      stock: 55,
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      ],
    },
  ];

  for (const item of products) {
    const slug = generateSlug(item.name);
    const categoryId = categories[item.category].id;

    await prisma.product.upsert({
      where: { slug },
      update: {
        description: item.description,
        price: item.price,
        stock: item.stock,
        images: item.images,
        status: "ACTIVE",
        categoryId,
        vendorId: vendor.id,
      },
      create: {
        name: item.name,
        slug,
        description: item.description,
        price: item.price,
        stock: item.stock,
        images: item.images,
        status: "ACTIVE",
        categoryId,
        vendorId: vendor.id,
      },
    });
  }

  const productCount = await prisma.product.count({ where: { status: "ACTIVE" } });

  console.log("✅ Seed complete!");
  console.log(`   Products in catalog: ${productCount}`);
  console.log("   Demo logins (password for all):", DEMO_PASSWORD);
  console.log("   - admin@auramarket.com (ADMIN)");
  console.log("   - vendor@auramarket.com (VENDOR, approved)");
  console.log("   - customer@auramarket.com (CUSTOMER)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
