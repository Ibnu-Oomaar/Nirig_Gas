import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const product = await prisma.fuelProduct.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const old = await prisma.fuelProduct.findUnique({ where: { id: params.id } });
  if (!old) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Track price changes
  if ((body.costPrice && body.costPrice !== old.costPrice) || (body.sellingPrice && body.sellingPrice !== old.sellingPrice)) {
    await prisma.priceHistory.create({
      data: {
        productId: params.id,
        oldCostPrice: old.costPrice,
        newCostPrice: body.costPrice ?? old.costPrice,
        oldSellPrice: old.sellingPrice,
        newSellPrice: body.sellingPrice ?? old.sellingPrice,
        changedBy: session.user.name ?? session.user.email ?? "Unknown",
        reason: body.priceChangeReason,
      },
    });
  }

  // Track stock adjustments
  if (body.currentStock !== undefined && body.currentStock !== old.currentStock) {
    const diff = body.currentStock - old.currentStock;
    await prisma.stockMovement.create({
      data: {
        productId: params.id,
        type: diff > 0 ? "IN" : diff < 0 ? "OUT" : "ADJUSTMENT",
        quantity: Math.abs(diff),
        beforeStock: old.currentStock,
        afterStock: body.currentStock,
        reason: body.adjustmentReason || "Manual adjustment",
      },
    });
  }

  const updated = await prisma.fuelProduct.update({
    where: { id: params.id },
    data: {
      name: body.name,
      sellingPrice: body.sellingPrice,
      costPrice: body.costPrice,
      currentStock: body.currentStock,
      minimumStock: body.minimumStock,
      maximumStock: body.maximumStock,
      tankCapacity: body.tankCapacity,
      tankNumber: body.tankNumber,
      description: body.description,
      isActive: body.isActive,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.fuelProduct.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
