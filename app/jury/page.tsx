import Image from "next/image";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { NoteForm } from "@/components/jury/NoteForm";

const JURY_CRITERES = [
  { label: "Goût", points: 20, aide: "Équilibre des saveurs, justesse des parfums, plaisir en bouche." },
  { label: "Technique et texture", points: 10, aide: "Maîtrise des cuissons, finesse des crèmes, régularité des couches." },
  { label: "Visuel", points: 10, aide: "Netteté du dressage, propreté des finitions, harmonie des couleurs." },
  { label: "Originalité et respect du thème", points: 10, aide: "Idée personnelle, lien avec la bûche de Noël, cohérence de la création." },
];

export default async function JuryPage() {
  const session = await getSession();
  if (!session) return null;

  const [confirmed, myNotes] = await Promise.all([
    prisma.participant.findMany({ where: { statut: "confirmee" }, orderBy: { createdAt: "asc" } }),
    prisma.note.findMany({ where: { juryUserId: session.sub } }),
  ]);

  const noteByParticipant = new Map(myNotes.map((n) => [n.participantId, n]));
  const notedCount = confirmed.filter((p) => noteByParticipant.has(p.id)).length;

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">Espace jury</h1>
          <p className="mt-1 text-sm text-ink/60">Connecté en tant que {session.nom}</p>
        </div>
        <LogoutButton />
      </div>

      <p className="mt-4 max-w-2xl text-sm text-ink/70">
        Dégustation à l&apos;aveugle : les bûches sont numérotées, sans nom de candidat. Notez
        chaque bûche sur les 4 critères du règlement (total /50). Vous pouvez modifier une note
        tant que les résultats ne sont pas publiés.
      </p>
      <p className="mt-2 text-sm font-semibold text-bordeaux">
        {notedCount}/{confirmed.length} bûches notées
      </p>

      {confirmed.length === 0 ? (
        <p className="mt-8 rounded-xl2 border border-dashed border-bordeaux/30 bg-white/60 p-6 text-sm text-ink/70">
          Aucune bûche confirmée pour l&apos;instant.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {confirmed.map((participant, index) => {
            const existing = noteByParticipant.get(participant.id);
            return (
              <section key={participant.id} className="rounded-xl2 bg-white p-6 shadow-soft">
                <h2 className="font-display text-lg text-bordeaux">Bûche n°{index + 1}</h2>
                <p className="mt-1 text-sm text-ink/70">
                  <span className="font-medium">{participant.nomBuche}</span> — {participant.composition}
                </p>
                <div className="mt-4">
                  <NoteForm
                    participantId={participant.id}
                    initial={
                      existing
                        ? {
                            gout: existing.gout,
                            techniqueTexture: existing.techniqueTexture,
                            visuel: existing.visuel,
                            originalite: existing.originalite,
                          }
                        : null
                    }
                  />
                </div>
              </section>
            );
          })}
        </div>
      )}

      <section className="mt-16 grid gap-10 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">Votre rôle</p>
          <h2 className="font-display text-3xl font-semibold text-bordeaux">Un jury, trois regards</h2>
          <p className="text-sm leading-relaxed text-ink/75">
            Le jury est composé de trois personnes. Il goûte chaque bûche à l&apos;aveugle, sans
            connaître le nom du candidat, puis attribue les notes selon la grille ci-dessous.
          </p>
        </div>
        <div className="relative h-72 w-full overflow-hidden rounded-xl2 shadow-soft md:h-80">
          <Image
            src="/images/10_photos_le_four_du_canal/05_photo_four_du_canal.png"
            alt="Trois jurés dégustant les bûches à l'aveugle"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">Grille de notation</p>
        <h2 className="font-display text-2xl font-semibold text-bordeaux">Les 4 critères (total /50)</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JURY_CRITERES.map((c) => (
            <div key={c.label} className="rounded-xl2 bg-white p-6 shadow-soft">
              <p className="font-display text-3xl font-semibold text-gold-dark">/{c.points}</p>
              <h3 className="mt-2 font-semibold text-bordeaux">{c.label}</h3>
              <p className="mt-2 text-sm text-ink/70">{c.aide}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
