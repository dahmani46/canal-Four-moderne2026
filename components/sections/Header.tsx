"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "#presentation", label: "Le concours" },
  { href: "#programme", label: "Programme" },
  { href: "#galerie", label: "Galerie" },
  { href: "#anciens-gagnants", label: "Anciens gagnants" },
  { href: "#avis", label: "Avis" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-12">
        <a href="#" className="font-display text-lg font-semibold text-bordeaux md:text-xl">
          Le Four du Canal
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-[0.15em] text-ink/70 transition hover:text-bordeaux"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#inscription"
            className="hidden rounded-full bg-bordeaux px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark sm:inline-block"
          >
            S&apos;inscrire
          </a>
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 lg:hidden"
          >
            <span className="font-display text-lg text-bordeaux">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink/5 bg-cream px-6 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm uppercase tracking-[0.15em] text-ink/70 transition hover:bg-bordeaux/5 hover:text-bordeaux"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inscription"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-bordeaux px-5 py-2.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-cream"
          >
            S&apos;inscrire
          </a>
        </nav>
      )}
    </header>
  );
}
