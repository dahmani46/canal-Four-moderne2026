"use client";

import { useState } from "react";
import type { FaqReglementPage as FaqReglementPageData } from "@/types/page";

export function FaqReglementPage({ page }: { page: FaqReglementPageData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="reveal w-full bg-bordeaux py-20 text-cream md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:px-12">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-gold">{page.subtitle}</p>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Questions fréquentes</h2>

        <div className="mt-6 flex flex-col gap-2">
          {page.faq.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} className="overflow-hidden rounded-xl2 bg-cream/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                  aria-expanded={open}
                >
                  {item.question}
                  <span className="text-gold">{open ? "–" : "+"}</span>
                </button>
                {open && <p className="px-4 pb-3 text-sm text-cream/80">{item.reponse}</p>}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold">Règlement & confidentialité</h2>
        <p className="mt-4 text-sm text-cream/80">
          La participation au concours implique l&apos;acceptation du règlement présenté lors de
          l&apos;inscription. Les données collectées (nom, e-mail, téléphone) servent uniquement à
          la gestion du concours (confirmation, liste d&apos;attente, contact le jour J) et ne sont
          ni cédées ni utilisées à d&apos;autres fins. Conformément au RGPD, vous pouvez demander la
          consultation, la correction ou la suppression de vos données en contactant la boutique.
        </p>
      </div>
      </div>
    </section>
  );
}
