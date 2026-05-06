import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { amount, method, reference, notes } = body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const oldPayment = await tx.payment.findUnique({
        where: { id: params.id },
        include: { transaction: true }
      });

      if (!oldPayment) throw new Error("Payment not found");

      // Update the payment
      const updatedPayment = await tx.payment.update({
        where: { id: params.id },
        data: {
          amount: amount ? parseFloat(amount) : undefined,
          method,
          reference,
          notes,
        },
      });

      // If amount changed, update transaction balance
      if (amount && parseFloat(amount) !== oldPayment.amount) {
        const diff = parseFloat(amount) - oldPayment.amount;
        const newPaidAmount = oldPayment.transaction.paidAmount + diff;
        const newBalance = Math.max(0, oldPayment.transaction.totalAmount - newPaidAmount);

        await tx.transaction.update({
          where: { id: oldPayment.transactionId },
          data: {
            paidAmount: newPaidAmount,
            balance: newBalance,
            status: newBalance === 0 ? "COMPLETED" : "PENDING",
          },
        });
      }

      return updatedPayment;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: params.id },
        include: { transaction: true }
      });

      if (!payment) throw new Error("Payment not found");

      // Revert transaction balance
      const newPaidAmount = payment.transaction.paidAmount - payment.amount;
      const newBalance = Math.max(0, payment.transaction.totalAmount - newPaidAmount);

      await tx.transaction.update({
        where: { id: payment.transactionId },
        data: {
          paidAmount: newPaidAmount,
          balance: newBalance,
          status: newBalance === 0 ? "COMPLETED" : "PENDING",
        },
      });

      // Delete the payment
      await tx.payment.delete({
        where: { id: params.id },
      });

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
