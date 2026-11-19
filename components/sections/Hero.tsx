interface HeroDetail {
  label: string;
  value: string;
}

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  details: HeroDetail[];
  videoSrc: string;
  posterSrc: string;
}

export function Hero({ title, subtitle, description, details, videoSrc, posterSrc }: HeroProps) {
  return (
    <section className="relative flex min-h-[90vh] w-full items-center overflow-hidden bg-ink text-cream">
      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center md:hidden"
        style={{ backgroundImage: `url(${posterSrc})` }}
        role="img"
        aria-label={title}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-24 md:grid-cols-[1.3fr_1fr] md:items-center md:px-12">
        <div className="reveal flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-gold">{subtitle}</p>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="max-w-xl text-base text-cream/85 sm:text-lg">{description}</p>

          <div className="mt-2 flex flex-wrap gap-4">
            <a
              href="#inscription"
              className="rounded-full bg-bordeaux px-7 py-3 text-sm uppercase tracking-[0.2em] text-cream shadow-soft transition hover:bg-bordeaux-dark"
            >
              S&apos;inscrire au concours
            </a>
            <a
              href="#presentation"
              className="rounded-full border border-cream/50 px-7 py-3 text-sm uppercase tracking-[0.2em] text-cream transition hover:bg-cream/10"
            >
              Découvrir
            </a>
          </div>
        </div>

        <div className="reveal grid grid-cols-2 gap-3 rounded-xl2 bg-cream/10 p-5 backdrop-blur sm:gap-4 sm:p-6">
          {details.map((d) => (
            <div key={d.label} className="rounded-xl2 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">{d.label}</p>
              <p className="mt-1 font-display text-lg sm:text-xl">{d.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
