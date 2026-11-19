import Image from "next/image";
import type { CraftPage as CraftPageData } from "@/types/page";

interface CraftPageProps {
  page: CraftPageData;
}

export function CraftPage({ page }: CraftPageProps) {
  return (
    <section id="savoir-faire" className="reveal w-full bg-bordeaux-dark py-20 text-cream md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">{page.subtitle}</p>
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">{page.title}</h2>
        <p className="mt-3 max-w-prose text-sm text-cream/80">{page.description}</p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {page.steps?.map((step, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-xl2 bg-cream/10">
              {step.image && (
                <div className="relative h-44 w-full">
                  <Image src={step.image.src} alt={step.image.alt} fill sizes="400px" className="object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1 p-5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-cream/75">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
