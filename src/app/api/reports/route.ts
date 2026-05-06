import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfMonth, subMonths } from "date-fns";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : subMonths(new Date(), 1);
  const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date();

  const [transactions, expenses, stockMovements] = await Promise.all([
    prisma.transaction.findMany({
      where: { createdAt: { gte: from, lte: to } },
      include: { items: { include: { product: true } }, cashier: true, customer: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.expense.findMany({ where: { date: { gte: from, lte: to } }, orderBy: { date: "desc" } }),
    prisma.stockMovement.findMany({
      where: { createdAt: { gte: from, lte: to } },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const revenue = transactions.filter(t => t.type === "SALE" && t.status === "COMPLETED").reduce((s, t) => s + t.totalAmount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const litresSold = transactions
    .filter(t => t.type === "SALE")
    .reduce((s, t) => s + t.items.reduce((ss, i) => ss + i.quantity, 0), 0);

  return NextResponse.json({
    summary: {
      revenue,
      expenses: totalExpenses,
      profit: revenue - totalExpenses,
      litresSold: Math.round(litresSold),
      transactionCount: transactions.filter(t => t.type === "SALE").length,
    },
    transactions,
    expenses,
    stockMovements,
  });
}
