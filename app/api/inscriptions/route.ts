import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inscriptionSchema = z.object({
  prenom: z.string().trim().min(1, "Prénom requis"),
  nom: z.string().trim().min(1, "Nom requis"),
  email: z.string().trim().email("E-mail invalide"),
  telephone: z.string().trim().min(6, "Téléphone invalide"),
  nomBuche: z.string().trim().min(1, "Nom de la bûche requis"),
  composition: z.string().trim().min(1, "Composition requise"),
  accepteReglement: z.literal(true, { message: "Vous devez accepter le règlement" }),
  consentementRGPD: z.literal(true, { message: "Le consentement RGPD est requis" }),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = inscriptionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const existing = await prisma.participant.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json(
      { error: "doublon", message: "Cette adresse e-mail est déjà inscrite au concours." },
      { status: 409 }
    );
  }

  const config = await prisma.concoursConfig.findUnique({ where: { id: "singleton" } });
  const placesMax = config?.placesMax ?? 20;

  if (config?.dateCloture && new Date() > config.dateCloture) {
    return NextResponse.json(
      { error: "clos", message: "Les inscriptions sont closes." },
      { status: 403 }
    );
  }

  const confirmedCount = await prisma.participant.count({ where: { statut: "confirmee" } });
  const statut = confirmedCount < placesMax ? "confirmee" : "attente";

  const participant = await prisma.participant.create({
    data: { ...data, statut },
  });

  return NextResponse.json({
    statut: participant.statut,
    message:
      participant.statut === "confirmee"
        ? "Inscription confirmée, à bientôt pour le concours !"
        : "Les places confirmées sont complètes : vous êtes sur liste d'attente.",
  });
}
