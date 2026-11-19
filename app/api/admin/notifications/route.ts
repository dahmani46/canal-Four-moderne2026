import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Participant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { buildConfirmationMessage, buildRappelMessage } from "@/lib/notifications";

const bodySchema = z.object({
  type: z.enum(["confirmation", "rappel"]),
  participantId: z.string().min(1).optional(),
  bulk: z.boolean().optional(),
});

function buildMessage(type: "confirmation" | "rappel", participant: Participant) {
  return type === "confirmation" ? buildConfirmationMessage(participant) : buildRappelMessage(participant);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin_patisserie") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const { type, participantId, bulk } = parsed.data;

  if (bulk) {
    const confirmed = await prisma.participant.findMany({ where: { statut: "confirmee" } });
    const existingPending = await prisma.notification.findMany({
      where: { type, statut: "a_envoyer", participantId: { in: confirmed.map((p) => p.id) } },
      select: { participantId: true },
    });
    const skip = new Set(existingPending.map((n) => n.participantId));
    const targets = confirmed.filter((p) => !skip.has(p.id));

    await prisma.notification.createMany({
      data: targets.map((participant) => {
        const { sujet, contenu } = buildMessage(type, participant);
        return {
          participantId: participant.id,
          type,
          sujet,
          contenu,
          preparedBy: session.nom,
        };
      }),
    });

    return NextResponse.json({ created: targets.length, skipped: skip.size });
  }

  if (!participantId) {
    return NextResponse.json({ message: "participantId requis." }, { status: 400 });
  }

  const participant = await prisma.participant.findUnique({ where: { id: participantId } });
  if (!participant) {
    return NextResponse.json({ message: "Participant introuvable." }, { status: 404 });
  }

  const { sujet, contenu } = buildMessage(type, participant);
  const notification = await prisma.notification.create({
    data: { participantId, type, sujet, contenu, preparedBy: session.nom },
  });

  return NextResponse.json({ id: notification.id });
}
