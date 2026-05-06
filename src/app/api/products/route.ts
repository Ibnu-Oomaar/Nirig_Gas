import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.fuelProduct.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const product = await prisma.fuelProduct.create({
    data: {
      name: body.name,
      fuelType: body.fuelType,
      unit: body.unit || "Litre",
      currentStock: body.currentStock || 0,
      minimumStock: body.minimumStock,
      maximumStock: body.maximumStock,
      costPrice: body.costPrice,
      sellingPrice: body.sellingPrice,
      tankCapacity: body.tankCapacity,
      tankNumber: body.tankNumber,
      description: body.description,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
