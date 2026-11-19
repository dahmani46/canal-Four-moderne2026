export type ProductCategory =
  | "gateaux-entremets"
  | "tartes-tartelettes"
  | "macarons"
  | "viennoiseries"
  | "patisseries-individuelles"
  | "creations-speciales";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  /** Prix de démonstration, en euros. Facultatif. */
  price?: number;
  category: ProductCategory;
  ingredients?: string[];
  /** Toujours vrai : signale explicitement une donnée de démonstration fictive. */
  isFictional: true;
}
