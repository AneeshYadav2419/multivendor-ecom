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



  console.log("✅ Seed complete!");
  // console.log(`   Products in catalog: ${productCount}`);
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
