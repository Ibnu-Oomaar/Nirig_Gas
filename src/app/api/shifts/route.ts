import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shifts = await prisma.shift.findMany({
    where: { userId: session.user.id },
    orderBy: { startTime: "desc" },
    take: 30,
  });
  return NextResponse.json(shifts);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Check if already has active shift
  const active = await prisma.shift.findFirst({
    where: { userId: session.user.id, isActive: true },
  });
  if (active) return NextResponse.json({ error: "You already have an active shift" }, { status: 409 });

  const shift = await prisma.shift.create({
    data: {
      userId: session.user.id,
      openingCash: body.openingCash || 0,
    },
  });
  return NextResponse.json(shift, { status: 201 });
}
