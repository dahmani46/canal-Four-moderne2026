import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ParticipantActions } from "@/components/admin/ParticipantActions";
import { PrepareNotificationButton } from "@/components/admin/PrepareNotificationButton";
import { NotificationList } from "@/components/admin/NotificationList";
import { noteTotal, TOTAL_MAX } from "@/lib/classement";
import { statutBadgeClass, statutLabel, type Statut } from "@/lib/statut";

export default async function ParticipantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const canEdit = session?.role === "admin_patisserie";

  const participant = await prisma.participant.findUnique({
    where: { id },
    include: {
      notes: true,
      notifications: { orderBy: { preparedAt: "desc" } },
    },
  });

  if (!participant) notFound();

  const jurors =
    participant.notes.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: participant.notes.map((n) => n.juryUserId) } },
        })
      : [];
  const jurorName = (id: string) => jurors.find((j) => j.id === id)?.nom ?? "Juré inconnu";

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">
            {participant.prenom} {participant.nom}
          </h1>
          <Link href="/admin/participants" className="mt-1 inline-block text-sm text-ink/60 hover:text-bordeaux">
            ← Retour aux participants
          </Link>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-xl2 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-bordeaux">Fiche candidat</h2>
            <span className={`rounded-full px-3 py-1 text-xs ${statutBadgeClass(participant.statut)}`}>
              {statutLabel(participant.statut)}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <Field label="E-mail" value={participant.email} />
            <Field label="Téléphone" value={participant.telephone} />
            <Field label="Nom de la bûche" value={participant.nomBuche} />
            <Field label="Inscrit le" value={participant.createdAt.toLocaleDateString("fr-FR")} />
            <Field label="Règlement accepté" value={participant.accepteReglement ? "Oui" : "Non"} />
            <Field label="Consentement RGPD" value={participant.consentementRGPD ? "Oui" : "Non"} />
          </dl>
          <div className="mt-3">
            <p className="text-xs uppercase tracking-[0.15em] text-ink/50">Composition de la bûche</p>
            <p className="mt-1 text-sm text-ink/80">{participant.composition}</p>
          </div>

          <div className="mt-6">
            {canEdit ? (
              <ParticipantActions participantId={participant.id} statut={participant.statut as Statut} />
            ) : (
              <p className="text-xs italic text-ink/40">
                Consultation uniquement — la validation/refus se fait depuis l&apos;administration
                pâtisserie.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl2 bg-white p-6 shadow-soft">
          <h2 className="font-display text-xl text-bordeaux">Notes du jury</h2>
          {participant.notes.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">Aucune note reçue pour l&apos;instant.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.1em] text-ink/50">
                  <tr>
                    <th className="py-1 pr-2">Juré</th>
                    <th className="py-1 pr-2">Goût</th>
                    <th className="py-1 pr-2">Technique</th>
                    <th className="py-1 pr-2">Visuel</th>
                    <th className="py-1 pr-2">Original.</th>
                    <th className="py-1 pr-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {participant.notes.map((n) => (
                    <tr key={n.id} className="border-t border-ink/5">
                      <td className="py-1.5 pr-2">{jurorName(n.juryUserId)}</td>
                      <td className="py-1.5 pr-2">{n.gout}/20</td>
                      <td className="py-1.5 pr-2">{n.techniqueTexture}/10</td>
                      <td className="py-1.5 pr-2">{n.visuel}/10</td>
                      <td className="py-1.5 pr-2">{n.originalite}/10</td>
                      <td className="py-1.5 pr-2 font-semibold text-bordeaux">
                        {noteTotal(n)}/{TOTAL_MAX}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl2 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl text-bordeaux">Notifications</h2>
          {canEdit && (
            <div className="flex gap-2">
              <PrepareNotificationButton
                participantId={participant.id}
                type="confirmation"
                label="Préparer confirmation"
              />
              <PrepareNotificationButton participantId={participant.id} type="rappel" label="Préparer rappel" />
            </div>
          )}
        </div>
        <div className="mt-4">
          <NotificationList notifications={participant.notifications} />
        </div>
      </section>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.15em] text-ink/50">{label}</p>
      <p className="mt-0.5 text-ink">{value}</p>
    </div>
  );
}
