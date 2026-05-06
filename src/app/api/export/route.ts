import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "transactions";
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : subDays(new Date(), 30);
  const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date();

  let csv = "";

  if (type === "transactions") {
    const data = await prisma.transaction.findMany({
      where: { createdAt: { gte: from, lte: to } },
      include: { cashier: { select: { name: true } }, customer: true },
      orderBy: { createdAt: "desc" },
    });

    csv = [
      "Invoice,Type,Status,Payment,Total,Paid,Balance,Cashier,Customer,Date",
      ...data.map((t) =>
        [
          t.invoiceNumber, t.type, t.status, t.paymentMethod,
          t.totalAmount.toFixed(2), t.paidAmount.toFixed(2), t.balance.toFixed(2),
          t.cashier.name, t.customer?.name || "Walk-in",
          new Date(t.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");
  } else if (type === "stock") {
    const data = await prisma.fuelProduct.findMany({ where: { isActive: true } });
    csv = [
      "Name,Fuel Type,Tank No,Current Stock,Min Stock,Max Stock,Capacity,Cost Price,Sell Price,Unit",
      ...data.map((p) =>
        [
          p.name, p.fuelType, p.tankNumber || "",
          p.currentStock.toFixed(2), p.minimumStock, p.maximumStock, p.tankCapacity,
          p.costPrice.toFixed(3), p.sellingPrice.toFixed(3), p.unit,
        ].join(",")
      ),
    ].join("\n");
  } else if (type === "customers") {
    const data = await prisma.customer.findMany();
    csv = [
      "Name,Phone,Email,Vehicle Plate,Credit Limit,Balance,Active",
      ...data.map((c) =>
        [c.name, c.phone || "", c.email || "", c.vehiclePlate || "",
          c.creditLimit.toFixed(2), c.balance.toFixed(2), c.isActive].join(",")
      ),
    ].join("\n");
  } else if (type === "expenses") {
    const data = await prisma.expense.findMany({
      where: { date: { gte: from, lte: to } },
      orderBy: { date: "desc" },
    });
    csv = [
      "Title,Category,Amount,Description,Date",
      ...data.map((e) =>
        [e.title, e.category, e.amount.toFixed(2), e.description || "",
          new Date(e.date).toLocaleDateString()].join(",")
      ),
    ].join("\n");
  }

  const filename = `nirig-gas-${type}-${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
