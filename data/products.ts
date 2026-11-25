import type { Product } from "@/types/product";

/**
 * Données de démonstration — noms, prix et ingrédients sont fictifs.
 * Volontairement limité aux fiches dont on dispose d'une photo dédiée et
 * distincte. Mieux vaut moins de cartes que répéter une même photo.
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
  {
    id: "creation-buche-framboise",
    name: "Bûche de Noël aux framboises",
    description:
      "Glaçage miroir rouge, framboises fraîches, myrtilles et copeaux de chocolat blanc, décorée à la main par notre pâtissier.",
    image: { src: "/images/buche-framboise.webp", alt: "Pâtissière décorant une bûche de Noël aux framboises Canal-Four" },
    category: "creations-speciales",
    isFictional: true,
  },
];
