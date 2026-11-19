import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await prisma.concoursConfig.findUnique({ where: { id: "singleton" } });
  const placesMax = config?.placesMax ?? 20;
  const confirmedCount = await prisma.participant.count({ where: { statut: "confirmee" } });

  return NextResponse.json({
    placesMax,
    placesRestantes: Math.max(0, placesMax - confirmedCount),
    dateCloture: config?.dateCloture ?? null,
    cloturee: config?.dateCloture ? new Date() > config.dateCloture : false,
    resultatsPublies: config?.resultatsPublies ?? false,
  });
}
