import prisma from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function testLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.log(`User ${email} not found`);
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  console.log(`Login for ${email}: ${valid ? "SUCCESS" : "FAILED"}`);
}

async function main() {
  await testLogin("admin@niriggas.com", "admin123");
  await testLogin("cashier@niriggas.com", "cashier123");
  await testLogin("seller@niriggas.com", "seller123");
  process.exit(0);
}

main();
