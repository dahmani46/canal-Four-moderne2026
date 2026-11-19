import type { Notification, Participant } from "@prisma/client";
import { MarkNotificationSentButton } from "./MarkNotificationSentButton";

const TYPE_LABEL: Record<string, string> = {
  confirmation: "Confirmation d'inscription",
  rappel: "Rappel du concours",
};

type NotificationWithParticipant = Notification & { participant?: Participant };

export function NotificationList({
  notifications,
  showParticipant = false,
}: {
  notifications: NotificationWithParticipant[];
  showParticipant?: boolean;
}) {
  if (notifications.length === 0) {
    return <p className="text-sm text-ink/50">Aucune notification pour le moment.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {notifications.map((n) => (
        <div key={n.id} className="rounded-xl2 border border-ink/10 bg-white p-4 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-bordeaux">{TYPE_LABEL[n.type] ?? n.type}</p>
              {showParticipant && n.participant && (
                <p className="text-xs text-ink/60">
                  {n.participant.prenom} {n.participant.nom} — {n.participant.nomBuche}
                </p>
              )}
              <p className="text-xs text-ink/40">
                Préparée le {n.preparedAt.toLocaleDateString("fr-FR")} par {n.preparedBy}
                {n.sentAt && (
                  <>
                    {" "}
                    · Envoyée le {n.sentAt.toLocaleDateString("fr-FR")} par {n.sentBy}
                  </>
                )}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                n.statut === "envoyee" ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
              }`}
            >
              {n.statut === "envoyee" ? "Envoyée" : "À envoyer"}
            </span>
          </div>

          <details className="mt-3 text-sm">
            <summary className="cursor-pointer text-xs uppercase tracking-[0.15em] text-ink/50">
              {n.sujet}
            </summary>
            <textarea
              readOnly
              value={n.contenu}
              rows={6}
              className="mt-2 w-full rounded-lg border border-ink/15 bg-cream/40 p-3 text-sm text-ink"
              onFocus={(e) => e.currentTarget.select()}
            />
          </details>

          {n.statut === "a_envoyer" && (
            <div className="mt-3">
              <MarkNotificationSentButton notificationId={n.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
