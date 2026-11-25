import type { ProductsPage } from "@/types/page";
import { ProductCard } from "./ProductCard";

interface ProductsGridPageProps {
  page: ProductsPage;
}

export function ProductsGridPage({ page }: ProductsGridPageProps) {
  return (
    <section id="specialites" className="reveal w-full bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">{page.subtitle}</p>
        <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">{page.title}</h2>
        <p className="mt-3 max-w-prose font-display text-sm text-ink/80">{page.description}</p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {page.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <p className="mt-6 text-xs italic text-ink/40">
          Produits et prix présentés à titre de démonstration.
        </p>
      </div>
    </section>
  );
}
