import Image from "next/image";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-page">
      <div className="relative h-48 w-full sm:h-56">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-semibold text-bordeaux">{product.name}</h3>
        <p className="line-clamp-3 text-sm text-ink/70">{product.description}</p>
        {typeof product.price === "number" && (
          <span className="mt-auto pt-2 text-sm font-semibold text-gold-dark">
            {product.price} € <span className="font-normal text-ink/50">(démo)</span>
          </span>
        )}
      </div>
    </article>
  );
}
