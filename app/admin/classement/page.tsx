import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { CRITERES, computeClassement, TOTAL_MAX } from "@/lib/classement";

export const dynamic = "force-dynamic";

export default async function ClassementPage() {
  const [confirmed, notes, nbJures] = await Promise.all([
    prisma.participant.findMany({ where: { statut: "confirmee" }, orderBy: { createdAt: "asc" } }),
    prisma.note.findMany(),
    prisma.user.count({ where: { role: "jury" } }),
  ]);

  const classement = computeClassement(
    confirmed,
    notes.filter((n) => confirmed.some((p) => p.id === n.participantId))
  );

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">Classement général</h1>
          <Link href="/admin" className="mt-1 inline-block text-sm text-ink/60 hover:text-bordeaux">
            ← Retour au tableau de bord
          </Link>
        </div>
        <LogoutButton />
      </div>

      <p className="mt-4 max-w-2xl text-sm text-ink/70">
        Score moyen des jurés ayant noté chaque bûche, sur {TOTAL_MAX} points ({CRITERES.map((c) => `${c.label} /${c.max}`).join(", ")}
        ). {nbJures} juré{nbJures > 1 ? "s" : ""} au total.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.15em] text-ink/50">
            <tr>
              <th className="px-4 py-3">Rang</th>
              <th className="px-4 py-3">Candidat</th>
              <th className="px-4 py-3">Bûche</th>
              {CRITERES.map((c) => (
                <th key={c.key} className="px-4 py-3">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3">Total /{TOTAL_MAX}</th>
              <th className="px-4 py-3">Jurés</th>
            </tr>
          </thead>
          <tbody>
            {classement.map((entry) => (
              <tr key={entry.participant.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-display text-lg text-gold-dark">
                  {entry.rang ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {entry.participant.prenom} {entry.participant.nom}
                </td>
                <td className="px-4 py-3 text-ink/70">{entry.participant.nomBuche}</td>
                {CRITERES.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-ink/70">
                    {entry.moyennes[c.key] !== null ? entry.moyennes[c.key]!.toFixed(1) : "—"}
                  </td>
                ))}
                <td className="px-4 py-3 font-semibold text-bordeaux">
                  {entry.moyenneTotal !== null ? entry.moyenneTotal.toFixed(1) : "—"}
                </td>
                <td className="px-4 py-3 text-ink/50">
                  {entry.nbNotes}/{nbJures}
                </td>
              </tr>
            ))}
            {classement.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-ink/50">
                  Aucun participant validé pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
