import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, verifyPassword, SESSION_COOKIE_NAME, type Role } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  role: z.enum(["admin_patisserie", "jury", "admin_general"]),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const { email, password, role } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role !== role || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "invalid", message: "Identifiants incorrects." },
      { status: 401 }
    );
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role as Role,
    nom: user.nom,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
