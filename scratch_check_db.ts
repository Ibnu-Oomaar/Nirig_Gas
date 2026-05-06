import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

async function check() {
  const connectionString = `${process.env.DATABASE_URL}`;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });
  
  try {
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
    const users = await prisma.user.findMany({ select: { email: true } });
    console.log("Users:", users);
  } catch (e) {
    console.error("Error connecting to DB:", e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
