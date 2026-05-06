import { Role, FuelType, SupplierStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Nirig Gas database...");

  // ── USERS ──
  const adminPw = await bcrypt.hash("admin123", 12);
  const cashierPw = await bcrypt.hash("cashier123", 12);
  const sellerPw = await bcrypt.hash("seller123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@niriggas.com" },
    update: {},
    create: {
      name: "Admin Nirig",
      email: "admin@niriggas.com",
      password: adminPw,
      role: Role.ADMIN,
      phone: "+252612345678",
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: "cashier@niriggas.com" },
    update: {},
    create: {
      name: "Cashier Hassan",
      email: "cashier@niriggas.com",
      password: cashierPw,
      role: Role.CASHIER,
      phone: "+252612345679",
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@niriggas.com" },
    update: {},
    create: {
      name: "Seller Fadumo",
      email: "seller@niriggas.com",
      password: sellerPw,
      role: Role.SELLER,
      phone: "+252612345680",
    },
  });

  console.log("✅ Seed complete!");
  console.log("\n🔑 Login credentials:");
  console.log("  Admin   → admin@niriggas.com   / admin123");
  console.log("  Cashier → cashier@niriggas.com / cashier123");
  console.log("  Seller  → seller@niriggas.com  / seller123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
