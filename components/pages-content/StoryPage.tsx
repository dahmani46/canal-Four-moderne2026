import Image from "next/image";
import type { StoryPage as StoryPageData } from "@/types/page";

interface StoryPageProps {
  page: StoryPageData;
}

export function StoryPage({ page }: StoryPageProps) {
  const [, secondary] = page.images ?? [];

  return (
    <section id="presentation" className="reveal w-full bg-cream py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-12">
        <div className="flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">{page.subtitle}</p>
          <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">
            {page.title}
          </h2>
          <p className="max-w-prose font-display text-ink/80">{page.description}</p>

          {page.milestones && (
            <ul className="mt-2 flex flex-col gap-3 border-l-2 border-gold/50 pl-5">
              {page.milestones.map((milestone, i) => (
                <li key={i} className="text-sm text-ink/70">
                  <span className="font-semibold text-bordeaux">{milestone.year}</span>{" "}
                  — {milestone.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative h-80 w-full overflow-hidden rounded-xl2 shadow-soft sm:h-96 md:h-[28rem]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/video/gemini_generated_video_gateaux.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Vidéo de gâteaux CANAL-FOUR"
          />

          {secondary && (
            <div className="absolute bottom-4 right-4 hidden h-32 w-44 overflow-hidden rounded-xl2 border-4 border-cream shadow-soft md:block">
              <Image src={secondary.src} alt={secondary.alt} fill sizes="200px" className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
