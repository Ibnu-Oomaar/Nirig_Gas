// src/lib/apiHelpers.ts
import { NextResponse } from "next/server";
import { getSession } from "./auth";
import { rateLimit } from "./rateLimit";
import { ZodSchema } from "zod";

type Role = "ADMIN" | "CASHIER" | "SELLER";

export async function withAuth(
  req: Request,
  handler: (session: any) => Promise<NextResponse>,
  allowedRoles?: Role[]
): Promise<NextResponse> {
  try {
    // Rate limit by IP
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { success } = rateLimit(`api:${ip}`, 200, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return await handler(session);
  } catch (error: any) {
    console.error("[API Error]", error);
    return NextResponse.json(
      { error: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

export async function validateBody<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const messages = parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return {
        data: null,
        error: NextResponse.json({ error: `Validation failed: ${messages}` }, { status: 400 }),
      };
    }
    return { data: parsed.data, error: null };
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}
