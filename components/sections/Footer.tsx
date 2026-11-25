const SOCIALS = [
  { label: "Instagram", icon: "IG" },
  { label: "Facebook", icon: "FB" },
];

const NAV_LINKS = [
  { href: "#presentation", label: "Le concours" },
  { href: "#galerie", label: "Galerie" },
  { href: "#inscription", label: "Inscription" },
  { href: "#faq", label: "FAQ & Règlement" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3 md:px-12">
        <div>
          <p className="font-display text-xl text-cream">Le Four du Canal</p>
          <p className="mt-2 text-sm text-cream/60">Pâtisserie artisanale — à la boutique.</p>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-cream/70 transition hover:text-gold">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Suivez-nous</p>
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-xs transition hover:border-gold hover:text-gold"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-6 text-center text-xs text-cream/40 md:px-12">
        <p>© {new Date().getFullYear()} Le Four du Canal — Tous droits réservés.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="/admin"
            className="inline-block rounded-full border border-gold/60 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-ink"
          >
            Espace admin
          </a>
          <a
            href="/jury/login"
            className="inline-block rounded-full border border-gold/60 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-ink"
          >
            Espace jury
          </a>
        </div>
      </div>
    </footer>
  );
}
