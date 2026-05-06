import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      cashier: { select: { name: true, email: true } },
      customer: true,
      supplier: true,
    },
  });

  if (!transaction) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(transaction);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.user.role === "SELLER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { status, paidAmount, notes } = body;

  const existing = await prisma.transaction.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.transaction.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(paidAmount !== undefined && {
        paidAmount,
        balance: existing.totalAmount - paidAmount,
      }),
      ...(notes && { notes }),
    },
  });

  // If paying off credit balance, update customer
  if (paidAmount !== undefined && existing.paymentMethod === "CREDIT" && existing.customerId) {
    const paymentDiff = paidAmount - existing.paidAmount;
    if (paymentDiff > 0) {
      await prisma.customer.update({
        where: { id: existing.customerId },
        data: { balance: { decrement: paymentDiff } },
      });
    }
  }

  return NextResponse.json(updated);
}
