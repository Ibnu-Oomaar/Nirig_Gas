import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "100");

  const where: any = {};
  if (session.user.role === "CASHIER") where.cashierId = session.user.id;
  if (type) where.type = type;
  if (status) where.status = status;

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: { include: { product: true } },
      cashier: { select: { name: true, email: true } },
      customer: true,
      supplier: true,
    },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "SELLER") return NextResponse.json({ error: "Sellers cannot create transactions" }, { status: 403 });

  const body = await req.json();
  const { type, paymentMethod, customerId, supplierId, paidAmount, discount, notes, items } = body;

  if (!items || items.length === 0)
    return NextResponse.json({ error: "No items provided" }, { status: 400 });

  // Validate stock for sales
  if (type === "SALE") {
    for (const item of items) {
      const product = await prisma.fuelProduct.findUnique({ where: { id: item.productId } });
      if (!product) return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
      if (product.currentStock < item.quantity)
        return NextResponse.json({ error: `Insufficient stock for ${product.name}. Available: ${product.currentStock} ${product.unit}` }, { status: 400 });
    }
  }

  // Calculate totals
  const subtotal = items.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0);
  const discountAmt = (subtotal * (discount || 0)) / 100;
  const totalAmount = subtotal - discountAmt;
  const paid = paymentMethod === "CREDIT" ? 0 : (paidAmount ?? totalAmount);
  const balance = totalAmount - paid;

  // Fetch cost prices for margin tracking
  const productIds = items.map((i: any) => i.productId);
  const products = await prisma.fuelProduct.findMany({ where: { id: { in: productIds } } });
  const costMap = Object.fromEntries(products.map(p => [p.id, p.costPrice]));

  // Create transaction + items + update stock in one transaction
  const result = await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        type: type || "SALE",
        status: "COMPLETED",
        paymentMethod: paymentMethod || "CASH",
        totalAmount,
        paidAmount: paid,
        balance,
        discount: discount || 0,
        notes,
        cashierId: session.user.id,
        customerId: customerId || null,
        supplierId: supplierId || null,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.quantity * i.unitPrice,
            costPrice: costMap[i.productId] ?? 0,
          })),
        },
      },
    });

    // Update stock levels
    for (const item of items) {
      const product = await tx.fuelProduct.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      const newStock = type === "SALE"
        ? product.currentStock - item.quantity
        : product.currentStock + item.quantity;

      await tx.fuelProduct.update({
        where: { id: item.productId },
        data: { currentStock: Math.max(0, newStock) },
      });

      // Log stock movement
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          type: type === "SALE" ? "OUT" : "IN",
          quantity: item.quantity,
          beforeStock: product.currentStock,
          afterStock: Math.max(0, newStock),
          reason: type === "SALE" ? `Sale: ${transaction.invoiceNumber}` : `Restock: ${transaction.invoiceNumber}`,
          reference: transaction.invoiceNumber,
          supplierId: supplierId || null,
        },
      });

      // Auto low-stock alert
      if (type === "SALE" && newStock <= product.minimumStock) {
        await tx.alert.create({
          data: {
            type: "LOW_STOCK",
            title: `Low Stock: ${product.name}`,
            message: `${product.name} is below minimum threshold. Current: ${Math.round(newStock)} ${product.unit}, Minimum: ${product.minimumStock} ${product.unit}`,
            createdById: session.user.id,
          },
        });
      }

      // Update customer balance for credit sales
      if (type === "SALE" && paymentMethod === "CREDIT" && customerId) {
        await tx.customer.update({
          where: { id: customerId },
          data: { balance: { increment: totalAmount } },
        });
      }
    }

    return transaction;
  });

  return NextResponse.json(result, { status: 201 });
}
