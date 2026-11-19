import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function AdminGeneralPage() {
  const session = await getSession();

  const [total, attente, confirmees, refusees, nbJures, config] = await Promise.all([
    prisma.participant.count(),
    prisma.participant.count({ where: { statut: "attente" } }),
    prisma.participant.count({ where: { statut: "confirmee" } }),
    prisma.participant.count({ where: { statut: "refusee" } }),
    prisma.user.count({ where: { role: "jury" } }),
    prisma.concoursConfig.findUnique({ where: { id: "singleton" } }),
  ]);

  const placesMax = config?.placesMax ?? 20;

  const tiles = [
    { label: "Inscrits (total)", value: total },
    { label: "En attente", value: attente },
    { label: "Validées", value: confirmees },
    { label: "Refusées", value: refusees },
  ];

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">
            Administration générale
          </h1>
          <p className="mt-1 text-sm text-ink/60">Connecté en tant que {session?.nom}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl2 bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{tile.label}</p>
            <p className="mt-2 font-display text-4xl text-bordeaux">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl2 border border-dashed border-bordeaux/30 bg-white/60 p-6 text-sm text-ink/70">
        Places confirmées : {confirmees}/{placesMax}. Jurés actifs : {nbJures}.
      </div>

      <nav className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin-general/jury"
          className="rounded-xl2 border border-bordeaux/20 bg-white p-6 shadow-soft transition hover:border-bordeaux/50"
        >
          <p className="font-display text-lg text-bordeaux">Gestion du jury</p>
          <p className="mt-1 text-sm text-ink/60">
            Liste des jurés, création de comptes, suivi des évaluations soumises.
          </p>
        </Link>
        <Link
          href="/admin/participants"
          className="rounded-xl2 border border-bordeaux/20 bg-white p-6 shadow-soft transition hover:border-bordeaux/50"
        >
          <p className="font-display text-lg text-bordeaux">Participants</p>
          <p className="mt-1 text-sm text-ink/60">Voir la liste et les fiches candidats.</p>
        </Link>
        <Link
          href="/admin/classement"
          className="rounded-xl2 border border-bordeaux/20 bg-white p-6 shadow-soft transition hover:border-bordeaux/50"
        >
          <p className="font-display text-lg text-bordeaux">Classement</p>
          <p className="mt-1 text-sm text-ink/60">Résultats calculés selon le barème validé.</p>
        </Link>
      </nav>
    </main>
  );
}
