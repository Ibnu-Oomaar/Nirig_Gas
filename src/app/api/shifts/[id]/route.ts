import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const shift = await prisma.shift.findUnique({ where: { id: params.id } });

  if (!shift) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (shift.userId !== session.user.id && session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Calculate totals since shift start
  const [salesAgg, fuelAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: { cashierId: shift.userId, type: "SALE", status: "COMPLETED", createdAt: { gte: shift.startTime } },
      _sum: { totalAmount: true },
    }),
    prisma.transactionItem.aggregate({
      where: { transaction: { cashierId: shift.userId, type: "SALE", status: "COMPLETED", createdAt: { gte: shift.startTime } } },
      _sum: { quantity: true },
    }),
  ]);

  const updated = await prisma.shift.update({
    where: { id: params.id },
    data: {
      endTime: new Date(),
      closingCash: body.closingCash ?? 0,
      isActive: false,
      totalSales: salesAgg._sum.totalAmount ?? 0,
      totalFuel: fuelAgg._sum.quantity ?? 0,
    },
  });

  return NextResponse.json(updated);
}
