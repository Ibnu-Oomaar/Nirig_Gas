import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const movements = await prisma.stockMovement.findMany({
    where: { ...(productId && { productId }) },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: true, supplier: true },
  });

  return NextResponse.json(movements);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const product = await prisma.fuelProduct.findUnique({ where: { id: body.productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const newStock = body.type === "IN"
    ? product.currentStock + body.quantity
    : body.type === "OUT"
    ? product.currentStock - body.quantity
    : body.quantity; // ADJUSTMENT = set directly

  await prisma.$transaction([
    prisma.stockMovement.create({
      data: {
        productId: body.productId,
        type: body.type,
        quantity: body.quantity,
        beforeStock: product.currentStock,
        afterStock: Math.max(0, newStock),
        reason: body.reason,
        supplierId: body.supplierId,
      },
    }),
    prisma.fuelProduct.update({
      where: { id: body.productId },
      data: { currentStock: Math.max(0, newStock) },
    }),
  ]);

  return NextResponse.json({ success: true, newStock: Math.max(0, newStock) });
}
