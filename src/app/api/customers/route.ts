import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await prisma.customer.findMany({
    where: { isActive: true },
    orderBy: { name: "desc" },
  });
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.user.role === "SELLER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      vehiclePlate: body.vehiclePlate,
      creditLimit: body.creditLimit || 0,
    },
  });

  return NextResponse.json(customer, { status: 201 });
}
