import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const updateData: any = {
    name: body.name,
    phone: body.phone,
    role: body.role,
    isActive: body.isActive,
  };

  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 12);
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, phone: true, isActive: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.user.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
