import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { items: { include: { product: true } } },
      },
    },
  });

  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.user.role === "SELLER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const customer = await prisma.customer.update({
    where: { id: params.id },
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      vehiclePlate: body.vehiclePlate,
      creditLimit: body.creditLimit,
      isActive: body.isActive,
    },
  });

  return NextResponse.json(customer);
}
