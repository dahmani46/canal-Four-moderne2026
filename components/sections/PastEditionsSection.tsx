import Image from "next/image";
import type { ContestEdition } from "@/types/contest-edition";

export function PastEditionsSection({ editions }: { editions: ContestEdition[] }) {
  const hasHistory = editions.length > 0;

  return (
    <section id="anciens-gagnants" className="reveal w-full bg-bordeaux-dark py-20 text-cream md:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">Mémoire du concours</p>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Les anciens concours et leurs gagnants
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-cream/70">
          Les créations qui ont marqué nos concours, année après année.
        </p>

        {!hasHistory ? (
          <div className="mx-auto mt-10 max-w-md rounded-xl2 border border-dashed border-cream/25 bg-cream/5 p-10">
            <p className="text-sm text-cream/70">
              Cette première édition se déroule le 5 décembre 2026 — l&apos;historique des gagnants
              et de leurs créations s&apos;écrira ici à partir de cette date.
            </p>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-12 text-left">
            {editions.map((edition) => (
              <div key={edition.annee}>
                <h3 className="font-display text-2xl text-gold">{edition.annee}</h3>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {edition.winners.map((winner) => (
                    <article key={winner.rang} className="overflow-hidden rounded-xl2 bg-cream/10">
                      {winner.creationPhoto && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={winner.creationPhoto.src}
                            alt={winner.creationPhoto.alt}
                            fill
                            sizes="400px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <span className="text-xs uppercase tracking-[0.2em] text-gold">{winner.rang}</span>
                        <h4 className="mt-1 font-display text-lg">{winner.creationNom}</h4>
                        <p className="text-sm text-cream/70">par {winner.nom}</p>
                        {winner.description && (
                          <p className="mt-2 text-sm text-cream/75">{winner.description}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
