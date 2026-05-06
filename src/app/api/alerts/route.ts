import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { createdBy: { select: { name: true } } },
  });
  return NextResponse.json(alerts);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const alert = await prisma.alert.create({
    data: {
      type: body.type,
      title: body.title,
      message: body.message,
      createdById: session.user.id,
    },
  });
  return NextResponse.json(alert, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Mark all as read
  await prisma.alert.updateMany({ data: { isRead: true } });
  return NextResponse.json({ success: true });
}
