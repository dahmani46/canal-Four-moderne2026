import type { Review } from "@/types/review";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label={`${rating} sur 5 étoiles`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section id="avis" className="reveal w-full bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">Témoignages</p>
        <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">
          Ils nous font confiance
        </h2>

        {reviews.length === 0 ? (
          <div className="mx-auto mt-10 max-w-md rounded-xl2 border border-dashed border-bordeaux/25 bg-white/60 p-10">
            <p className="font-display text-2xl text-gold-dark">★ ★ ★ ★ ★</p>
            <p className="mt-4 text-sm text-ink/70">
              Les avis de nos clients arrivent bientôt — nous collectons les retours après le
              premier concours de la bûche de Noël.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <article key={r.id} className="flex flex-col gap-3 rounded-xl2 bg-white p-6 shadow-soft">
                <Stars rating={r.rating} />
                <p className="text-sm text-ink/80">{r.comment}</p>
                <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-ink/50">
                  <span className="font-semibold text-bordeaux">{r.author}</span>
                  <span>·</span>
                  <time dateTime={r.date}>{new Date(r.date).toLocaleDateString("fr-FR")}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
