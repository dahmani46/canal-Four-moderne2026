import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { NotificationComposer } from "@/components/admin/NotificationComposer";
import { BulkRappelButton } from "@/components/admin/BulkRappelButton";
import { NotificationList } from "@/components/admin/NotificationList";

interface SearchParams {
  statut?: string;
  type?: string;
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { statut, type } = await searchParams;

  const [confirmed, notifications] = await Promise.all([
    prisma.participant.findMany({ where: { statut: "confirmee" }, orderBy: { createdAt: "asc" } }),
    prisma.notification.findMany({
      where: {
        ...(statut === "a_envoyer" || statut === "envoyee" ? { statut } : {}),
        ...(type === "confirmation" || type === "rappel" ? { type } : {}),
      },
      include: { participant: true },
      orderBy: { preparedAt: "desc" },
    }),
  ]);

  const participantOptions = confirmed.map((p) => ({
    id: p.id,
    label: `${p.prenom} ${p.nom} — ${p.nomBuche}`,
  }));

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">
            Centre de notifications
          </h1>
          <Link href="/admin" className="mt-1 inline-block text-sm text-ink/60 hover:text-bordeaux">
            ← Retour au tableau de bord
          </Link>
        </div>
        <LogoutButton />
      </div>

      <p className="mt-4 max-w-2xl text-sm text-ink/70">
        Prépare le texte des e-mails de confirmation et de rappel. Aucun envoi automatique :
        copie le texte dans votre messagerie, puis marque la notification comme envoyée une fois
        l&apos;e-mail réellement parti.
      </p>

      <section className="mt-6 rounded-xl2 bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg text-bordeaux">Préparer une notification</h2>
        <div className="mt-4">
          <NotificationComposer participants={participantOptions} />
        </div>
        <div className="mt-4 border-t border-ink/10 pt-4">
          <BulkRappelButton />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg text-bordeaux">Historique</h2>
          <form method="get" className="flex gap-2">
            <select
              name="type"
              defaultValue={type ?? ""}
              className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm text-ink outline-none focus:border-bordeaux"
            >
              <option value="">Tous les types</option>
              <option value="confirmation">Confirmation</option>
              <option value="rappel">Rappel</option>
            </select>
            <select
              name="statut"
              defaultValue={statut ?? ""}
              className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm text-ink outline-none focus:border-bordeaux"
            >
              <option value="">Tous les statuts</option>
              <option value="a_envoyer">À envoyer</option>
              <option value="envoyee">Envoyée</option>
            </select>
            <button
              type="submit"
              className="rounded-full bg-bordeaux px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark"
            >
              Filtrer
            </button>
          </form>
        </div>
        <div className="mt-4">
          <NotificationList notifications={notifications} showParticipant />
        </div>
      </section>
    </main>
  );
}
