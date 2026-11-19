import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

const bodySchema = z.object({
  nom: z.string().trim().min(1, "Nom requis"),
  email: z.string().trim().email("E-mail invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin_general") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Requête invalide." },
      { status: 400 }
    );
  }

  const { nom, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Cet e-mail est déjà utilisé." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { nom, email, passwordHash, role: "jury" },
  });

  return NextResponse.json({ id: user.id });
}
