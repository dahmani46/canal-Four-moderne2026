import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";

const STEPS = [
  { title: "Inscriptions", text: "Les candidats s'inscrivent en ligne, leur dossier arrive en attente." },
  { title: "Validation", text: "Chaque inscription est validée ou refusée, dans la limite des places." },
  { title: "Rappels", text: "Confirmations et rappels sont préparés, puis envoyés aux participants." },
  { title: "Classement", text: "Les notes du jury sont compilées pour établir le palmarès." },
];

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

      <section className="mt-16 grid gap-10 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">Le concours</p>
          <h2 className="font-display text-3xl font-semibold text-bordeaux">Piloter la bûche de Noël</h2>
          <p className="text-sm leading-relaxed text-ink/75">
            De l&apos;inscription du candidat à la publication du palmarès, chaque étape se suit
            depuis cet espace : valider les inscriptions, prévenir les participants, puis publier le
            classement établi par le jury.
          </p>
        </div>
        <div className="relative h-72 w-full overflow-hidden rounded-xl2 shadow-soft md:h-80">
          <Image
            src="/images/10_photos_le_four_du_canal/04_photo_four_du_canal.png"
            alt="Pâtissier décorant une bûche de Noël pour le concours"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">Étapes</p>
        <h2 className="font-display text-2xl font-semibold text-bordeaux">Le parcours d&apos;un concours</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-xl2 bg-white p-6 shadow-soft">
              <p className="font-display text-3xl font-semibold text-gold-dark">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-semibold text-bordeaux">{step.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
