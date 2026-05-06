import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id },
    include: { transactions: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(supplier);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const supplier = await prisma.supplier.update({
    where: { id: params.id },
    data: {
      name: body.name,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      status: body.status,
    },
  });
  return NextResponse.json(supplier);
}
