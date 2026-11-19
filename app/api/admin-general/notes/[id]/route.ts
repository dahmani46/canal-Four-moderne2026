import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin_general") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) {
    return NextResponse.json({ message: "Note introuvable." }, { status: 404 });
  }

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
