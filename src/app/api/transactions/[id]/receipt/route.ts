import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateReceiptHTML } from "@/lib/pdfReceipt";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tx = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: true } },
      cashier: { select: { name: true } },
      customer: true,
      supplier: true,
    },
  });

  if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const html = generateReceiptHTML(tx as any);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
