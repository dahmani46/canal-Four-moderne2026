import Image from "next/image";
import type { ConditionsProgrammePage as ConditionsProgrammePageData } from "@/types/page";

export function ConditionsProgrammePage({ page }: { page: ConditionsProgrammePageData }) {
  const image = page.images?.[0];

  return (
    <section id="programme" className="reveal w-full bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">{page.subtitle}</p>
            <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">{page.title}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {page.conditions.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink/80">
                  <span className="text-gold-dark">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {image && (
            <div className="relative h-64 overflow-hidden rounded-xl2 shadow-soft sm:h-80">
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          )}
        </div>

        <h3 className="mt-14 text-center font-display text-2xl text-bordeaux">Programme de la journée</h3>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {page.programme.map((p, i) => (
            <div key={i} className="rounded-xl2 bg-white p-6 text-center shadow-soft">
              <span className="font-display text-sm uppercase tracking-[0.2em] text-gold-dark">
                Étape {i + 1}
              </span>
              <p className="mt-2 font-display text-2xl text-bordeaux">{p.heure}</p>
              <p className="mt-1 text-sm text-ink/70">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
