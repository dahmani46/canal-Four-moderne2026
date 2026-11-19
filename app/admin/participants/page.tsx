import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { STATUTS, statutBadgeClass, statutLabel } from "@/lib/statut";
import type { Prisma } from "@prisma/client";

interface SearchParams {
  q?: string;
  statut?: string;
}

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, statut } = await searchParams;

  const where: Prisma.ParticipantWhereInput = {};
  if (statut && (STATUTS as readonly string[]).includes(statut)) {
    where.statut = statut;
  }
  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { prenom: { contains: term } },
      { nom: { contains: term } },
      { email: { contains: term } },
      { nomBuche: { contains: term } },
    ];
  }

  const participants = await prisma.participant.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">Participants</h1>
          <Link href="/admin" className="mt-1 inline-block text-sm text-ink/60 hover:text-bordeaux">
            ← Retour au tableau de bord
          </Link>
        </div>
        <LogoutButton />
      </div>

      <form method="get" className="mt-8 flex flex-wrap items-end gap-3 rounded-xl2 bg-white p-4 shadow-soft">
        <label className="flex flex-col text-xs text-ink/60">
          Recherche (nom, email, bûche)
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Ex. Camille, bûche choco…"
            className="mt-1 w-64 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux"
          />
        </label>
        <label className="flex flex-col text-xs text-ink/60">
          Statut
          <select
            name="statut"
            defaultValue={statut ?? ""}
            className="mt-1 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux"
          >
            <option value="">Tous</option>
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {statutLabel(s)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-bordeaux px-5 py-2 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark"
        >
          Filtrer
        </button>
        <Link href="/admin/participants" className="text-xs text-ink/50 underline hover:text-bordeaux">
          Réinitialiser
        </Link>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.15em] text-ink/50">
            <tr>
              <th className="px-4 py-3">Candidat</th>
              <th className="px-4 py-3">Bûche</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Inscrit le</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">
                    {p.prenom} {p.nom}
                  </p>
                  <p className="text-xs text-ink/50">{p.email}</p>
                </td>
                <td className="px-4 py-3 text-ink/80">{p.nomBuche}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${statutBadgeClass(p.statut)}`}>
                    {statutLabel(p.statut)}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/60">
                  {p.createdAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/participants/${p.id}`}
                    className="text-xs uppercase tracking-[0.15em] text-bordeaux underline hover:text-bordeaux-dark"
                  >
                    Voir la fiche
                  </Link>
                </td>
              </tr>
            ))}
            {participants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-ink/50">
                  Aucun participant ne correspond à cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
