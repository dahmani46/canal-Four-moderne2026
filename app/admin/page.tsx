import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function AdminPatisseriePage() {
  const session = await getSession();

  const [confirmees, attente] = await Promise.all([
    prisma.participant.count({ where: { statut: "confirmee" } }),
    prisma.participant.count({ where: { statut: "attente" } }),
  ]);

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">
            Administration pâtisserie
          </h1>
          <p className="mt-1 text-sm text-ink/60">Connecté en tant que {session?.nom}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Inscriptions confirmées</p>
          <p className="mt-2 font-display text-4xl text-bordeaux">{confirmees} / 20</p>
        </div>
        <div className="rounded-xl2 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Liste d&apos;attente</p>
          <p className="mt-2 font-display text-4xl text-bordeaux">{attente}</p>
        </div>
      </div>

      <p className="mt-10 rounded-xl2 border border-dashed border-bordeaux/30 bg-white/60 p-6 text-sm text-ink/70">
        Les fiches candidats, le classement, la correction des notes et la publication des
        résultats arrivent dans une prochaine passe (Phase C). Ce tableau de bord affiche déjà des
        données réelles issues de la base.
      </p>
    </main>
  );
}
