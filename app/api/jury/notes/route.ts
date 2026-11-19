import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const bodySchema = z.object({
  participantId: z.string().min(1),
  gout: z.number().int().min(0).max(20),
  techniqueTexture: z.number().int().min(0).max(10),
  visuel: z.number().int().min(0).max(10),
  originalite: z.number().int().min(0).max(10),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "jury") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Note invalide." }, { status: 400 });
  }

  const { participantId, ...scores } = parsed.data;

  const participant = await prisma.participant.findUnique({ where: { id: participantId } });
  if (!participant || participant.statut !== "confirmee") {
    return NextResponse.json({ message: "Participant non éligible à la notation." }, { status: 404 });
  }

  const note = await prisma.note.upsert({
    where: { participantId_juryUserId: { participantId, juryUserId: session.sub } },
    update: scores,
    create: { participantId, juryUserId: session.sub, ...scores },
  });

  return NextResponse.json({ id: note.id });
}
