import Image from "next/image";
import type { CriteresRecompensesPage as CriteresRecompensesPageData } from "@/types/page";

export function CriteresRecompensesPage({ page }: { page: CriteresRecompensesPageData }) {
  const image = page.images?.[0];
  const total = page.criteres.reduce((sum, c) => sum + c.points, 0);

  return (
    <section id="notation" className="reveal w-full bg-bordeaux-dark py-20 text-cream md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.2fr]">
          {image && (
            <div className="relative h-64 overflow-hidden rounded-xl2 shadow-soft sm:h-80">
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">{page.subtitle}</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{page.title}</h2>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-gold">
              Critères de notation ({total} points par juré)
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {page.criteres.map((c) => (
                <li key={c.label} className="flex items-center justify-between border-b border-cream/15 pb-2 text-sm">
                  <span>{c.label}</span>
                  <span className="font-display text-gold">{c.points} pts</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-gold">Récompenses</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {page.recompenses.map((r) => (
                <li key={r.rang} className="rounded-xl2 bg-cream/10 p-4">
                  <span className="block text-xs uppercase tracking-[0.2em] text-gold">{r.rang}</span>
                  <span className="text-sm">{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
