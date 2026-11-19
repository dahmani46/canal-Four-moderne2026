import Image from "next/image";
import type { GalleryPage as GalleryPageData } from "@/types/page";

const SPAN_CLASSES: Record<string, string> = {
  hero: "col-span-4 row-span-2 sm:col-span-2 md:col-span-2",
  wide: "col-span-4 sm:col-span-2 md:col-span-2",
  tall: "col-span-2 row-span-2 sm:col-span-1 md:col-span-1",
  normal: "col-span-2 sm:col-span-1 md:col-span-1",
};

export function GalleryMosaicPage({ page }: { page: GalleryPageData }) {
  return (
    <section id="galerie" className="reveal w-full bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">{page.subtitle}</p>
        <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">{page.title}</h2>

        <div className="mt-8 grid auto-rows-[160px] grid-cols-4 gap-4 sm:auto-rows-[200px]">
          {page.items.map((item, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-xl2 shadow-soft ${SPAN_CLASSES[item.span]}`}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              {item.caption && (
                <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs text-cream">
                  {item.caption}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
