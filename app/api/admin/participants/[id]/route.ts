import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { STATUTS } from "@/lib/statut";

const bodySchema = z.object({
  statut: z.enum(STATUTS),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin_patisserie") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Statut invalide." }, { status: 400 });
  }

  const participant = await prisma.participant.findUnique({ where: { id } });
  if (!participant) {
    return NextResponse.json({ message: "Participant introuvable." }, { status: 404 });
  }

  const updated = await prisma.participant.update({
    where: { id },
    data: { statut: parsed.data.statut },
  });

  return NextResponse.json({ statut: updated.statut });
}
