import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payments = await prisma.payment.findMany({
    include: {
      transaction: {
        include: {
          customer: true,
          cashier: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(payments);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { transactionId, amount, method, reference, notes } = body;

  if (!transactionId || !amount || !method) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Use a transaction to ensure data integrity
  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        transactionId,
        amount: parseFloat(amount),
        method,
        reference,
        notes,
      },
    });

    const transaction = await tx.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new Error("Transaction not found");

    const newPaidAmount = transaction.paidAmount + parseFloat(amount);
    const newBalance = Math.max(0, transaction.totalAmount - newPaidAmount);

    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        paidAmount: newPaidAmount,
        balance: newBalance,
        status: newBalance === 0 ? "COMPLETED" : "PENDING",
      },
    });

    return payment;
  });

  return NextResponse.json(result, { status: 201 });
}
