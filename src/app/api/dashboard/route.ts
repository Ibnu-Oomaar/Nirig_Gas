import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const todayStart = startOfDay(new Date());
  const weekAgo = subDays(new Date(), 7);

  const cashierId = session.user.role === "CASHIER" ? session.user.id : undefined;
  const txWhere: any = { type: "SALE", status: "COMPLETED", ...(cashierId && { cashierId }) };

  const [todayTx, weekTx, products, customers, expenses] = await Promise.all([
    prisma.transaction.findMany({
      where: { ...txWhere, createdAt: { gte: todayStart } },
      include: { items: true },
    }),
    prisma.transaction.findMany({
      where: { ...txWhere, createdAt: { gte: weekAgo } },
      include: { items: true },
    }),
    prisma.fuelProduct.findMany({ where: { isActive: true } }),
    prisma.customer.count({ where: { isActive: true } }),
    prisma.expense.aggregate({
      where: { date: { gte: weekAgo } },
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    todayRevenue: todayTx.reduce((s, t) => s + t.totalAmount, 0),
    todaySales: todayTx.length,
    weekRevenue: weekTx.reduce((s, t) => s + t.totalAmount, 0),
    weekSales: weekTx.length,
    weekExpenses: expenses._sum.amount ?? 0,
    totalCustomers: customers,
    lowStockCount: products.filter(p => p.currentStock <= p.minimumStock).length,
    totalStock: products.reduce((s, p) => s + p.currentStock, 0),
  });
}
