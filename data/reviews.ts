import type { Review } from "@/types/review";

/**
 * Avis fictifs de démonstration — aucun vrai client n'a laissé ces avis.
 * Clairement signalés comme tels dans ReviewsSection.tsx. À remplacer par de
 * vrais avis (Google, formulaire interne, etc.) dès qu'ils existeront.
 */
export const reviews: Review[] = [
  {
    id: "demo-1",
    author: "Camille D. (avis fictif)",
    rating: 5,
    comment:
      "Une bûche absolument délicieuse et un accueil très chaleureux en boutique. On sent le travail artisanal dans chaque détail.",
    date: "2025-12-18",
  },
  {
    id: "demo-2",
    author: "Antoine R. (avis fictif)",
    rating: 5,
    comment:
      "Participer au concours de la bûche de Noël était une super expérience. L'équipe est passionnée et très accueillante.",
    date: "2025-12-10",
  },
  {
    id: "demo-3",
    author: "Nadia L. (avis fictif)",
    rating: 4,
    comment:
      "De très belles pâtisseries, toujours fraîches. Le feuilletage des croissants est remarquable.",
    date: "2025-11-27",
  },
];
