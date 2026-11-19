"use client";

import { useEffect, useState } from "react";
import type { ResultatsPage as ResultatsPageData } from "@/types/page";

export function ResultatsPage({ page }: { page: ResultatsPageData }) {
  const [resultatsPublies, setResultatsPublies] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/concours/config")
      .then((r) => r.json())
      .then((data) => setResultatsPublies(Boolean(data.resultatsPublies)))
      .catch(() => setResultatsPublies(false));
  }, []);

  return (
    <section id="resultats" className="reveal w-full bg-cream py-20 md:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center md:px-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 font-display text-2xl text-gold-dark">
          ★
        </span>
        <p className="mt-6 text-xs uppercase tracking-[0.4em] text-gold-dark">{page.subtitle}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-bordeaux sm:text-4xl">
          {page.title}
        </h2>

        {resultatsPublies === null && <p className="mt-6 text-sm text-ink/50">Chargement…</p>}

        {resultatsPublies === false && (
          <p className="mt-6 max-w-md text-sm text-ink/70">
            Les résultats du concours seront publiés ici après la remise des prix, le 5 décembre
            2026 à 16h30.
          </p>
        )}

        {resultatsPublies === true && (
          <p className="mt-6 max-w-md text-sm text-ink/70">
            Le palmarès est publié — rendez-vous sur l&apos;administration pâtisserie pour le détail
            du classement (fonctionnalité à venir).
          </p>
        )}
      </div>
    </section>
  );
}
