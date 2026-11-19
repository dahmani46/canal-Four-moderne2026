import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin_patisserie") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) {
    return NextResponse.json({ message: "Notification introuvable." }, { status: 404 });
  }
  if (notification.statut === "envoyee") {
    return NextResponse.json({ message: "Déjà marquée comme envoyée." }, { status: 409 });
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { statut: "envoyee", sentAt: new Date(), sentBy: session.nom },
  });

  return NextResponse.json({ statut: updated.statut });
}
