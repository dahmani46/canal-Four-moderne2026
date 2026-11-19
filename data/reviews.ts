import type { Review } from "@/types/review";

/**
 * Aucun avis vérifié n'est disponible pour l'instant — volontairement vide
 * plutôt que de fabriquer des témoignages. À connecter à une source réelle
 * d'avis (Google, formulaire interne, etc.) dès qu'elle existe.
 */
export const reviews: Review[] = [];
