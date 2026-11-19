import type { Product } from "@/types/product";

/**
 * Données de démonstration — noms, prix et ingrédients sont fictifs.
 * Volontairement limité à 2 fiches : ce sont les deux seules photos produit
 * dédiées et distinctes disponibles. Mieux vaut moins de cartes que répéter
 * une même photo sur plusieurs fiches.
 */
export const demoProducts: Product[] = [
  {
    id: "demo-croissant-beurre",
    name: "Croissant Pur Beurre (démo)",
    description:
      "Pâte feuilletée levée, façonnée et cuite chaque matin — exemple de fiche produit.",
    image: { src: "/images/image4.jpg", alt: "Croissants pur beurre en cours de façonnage (visuel de démonstration)" },
    price: 2,
    category: "viennoiseries",
    ingredients: ["Farine de tradition", "Beurre AOP", "Levain"],
    isFictional: true,
  },
  {
    id: "demo-entremet-chocolat",
    name: "Entremet Chocolat Grand Cru (démo)",
    description:
      "Mousse chocolat 70%, cœur praliné noisette et glaçage miroir — exemple de fiche produit.",
    image: { src: "/images/image5.jpg", alt: "Entremet chocolat flambé (visuel de démonstration)" },
    price: 6,
    category: "patisseries-individuelles",
    ingredients: ["Chocolat grand cru", "Praliné noisette", "Glaçage miroir"],
    isFictional: true,
  },
];
