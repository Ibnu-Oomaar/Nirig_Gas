import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const todayStart = startOfDay(new Date());

  const [shift, todayTransactions] = await Promise.all([
    prisma.shift.findFirst({
      where: { userId: session.user.id, isActive: true },
      orderBy: { startTime: "desc" },
    }),
    prisma.transaction.findMany({
      where: { cashierId: session.user.id, createdAt: { gte: todayStart } },
      include: { customer: true, items: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const revenue = todayTransactions.filter(t => t.type === "SALE" && t.status === "COMPLETED").reduce((s, t) => s + t.totalAmount, 0);
  const litres = todayTransactions.filter(t => t.type === "SALE").reduce((s, t) => s + t.items.reduce((ss, i) => ss + i.quantity, 0), 0);

  return NextResponse.json({
    shift,
    todayTransactions,
    totals: { revenue, litres, count: todayTransactions.filter(t => t.type === "SALE").length },
  });
}
