import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DeleteNoteButton } from "@/components/admin-general/DeleteNoteButton";
import { noteTotal, TOTAL_MAX } from "@/lib/classement";

export default async function JurorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const juror = await prisma.user.findUnique({ where: { id } });
  if (!juror || juror.role !== "jury") notFound();

  const notes = await prisma.note.findMany({
    where: { juryUserId: id },
    include: { participant: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">{juror.nom}</h1>
          <Link href="/admin-general/jury" className="mt-1 inline-block text-sm text-ink/60 hover:text-bordeaux">
            ← Retour à la gestion du jury
          </Link>
        </div>
        <LogoutButton />
      </div>

      <section className="mt-8 overflow-x-auto rounded-xl2 bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.15em] text-ink/50">
            <tr>
              <th className="px-4 py-3">Bûche</th>
              <th className="px-4 py-3">Goût</th>
              <th className="px-4 py-3">Technique</th>
              <th className="px-4 py-3">Visuel</th>
              <th className="px-4 py-3">Original.</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {notes.map((n) => (
              <tr key={n.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">
                  {n.participant.prenom} {n.participant.nom} — {n.participant.nomBuche}
                </td>
                <td className="px-4 py-3">{n.gout}/20</td>
                <td className="px-4 py-3">{n.techniqueTexture}/10</td>
                <td className="px-4 py-3">{n.visuel}/10</td>
                <td className="px-4 py-3">{n.originalite}/10</td>
                <td className="px-4 py-3 font-semibold text-bordeaux">
                  {noteTotal(n)}/{TOTAL_MAX}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteNoteButton noteId={n.id} />
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-ink/50">
                  Ce juré n&apos;a pas encore soumis de note.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
