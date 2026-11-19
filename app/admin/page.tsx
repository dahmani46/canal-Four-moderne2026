import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function AdminPatisseriePage() {
  const session = await getSession();

  const [total, attente, confirmees] = await Promise.all([
    prisma.participant.count(),
    prisma.participant.count({ where: { statut: "attente" } }),
    prisma.participant.count({ where: { statut: "confirmee" } }),
  ]);

  const tiles = [
    { label: "Inscrits (total)", value: total },
    { label: "Inscriptions en attente", value: attente },
    { label: "Inscriptions validées", value: confirmees },
    { label: "Participants au concours", value: confirmees },
  ];

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">
            Administration pâtisserie
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

      <nav className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/participants"
          className="rounded-xl2 border border-bordeaux/20 bg-white p-6 shadow-soft transition hover:border-bordeaux/50"
        >
          <p className="font-display text-lg text-bordeaux">Participants</p>
          <p className="mt-1 text-sm text-ink/60">
            Liste, recherche, fiches candidats, validation et refus des inscriptions.
          </p>
        </Link>
        <Link
          href="/admin/classement"
          className="rounded-xl2 border border-bordeaux/20 bg-white p-6 shadow-soft transition hover:border-bordeaux/50"
        >
          <p className="font-display text-lg text-bordeaux">Classement</p>
          <p className="mt-1 text-sm text-ink/60">
            Résultats calculés selon le barème validé (Goût /20, Technique et texture /10, Visuel
            /10, Originalité /10).
          </p>
        </Link>
        <Link
          href="/admin/notifications"
          className="rounded-xl2 border border-bordeaux/20 bg-white p-6 shadow-soft transition hover:border-bordeaux/50"
        >
          <p className="font-display text-lg text-bordeaux">Notifications</p>
          <p className="mt-1 text-sm text-ink/60">
            Préparer les confirmations et rappels, suivre leur envoi.
          </p>
        </Link>
      </nav>
    </main>
  );
}
