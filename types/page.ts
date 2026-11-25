import type { Product, ProductCategory } from "./product";

export interface MediaAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface PageVideo {
  src: string;
  poster?: string;
  loop?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
}

export type PageTheme = "cream" | "bordeaux" | "dark";

interface BasePage {
  /** Identifiant unique, aussi utilisé comme clé de snap/scroll. */
  id: string;
  /** Position du feuillet dans le livre, 0 = couverture. */
  order: number;
  title: string;
  subtitle?: string;
  description?: string;
  images?: MediaAsset[];
  videos?: PageVideo[];
  theme?: PageTheme;
}

export interface CoverPage extends BasePage {
  type: "cover";
  cta: {
    label: string;
    targetPageId: string;
  };
}

export interface StoryPage extends BasePage {
  type: "story";
  milestones?: { year: string; label: string }[];
}

export interface ProductsPage extends BasePage {
  type: "products";
  category?: ProductCategory;
  products: Product[];
}

export interface CraftPage extends BasePage {
  type: "craft";
  steps?: { title: string; description: string; image?: MediaAsset }[];
}

export interface GalleryItem {
  image?: MediaAsset;
  video?: string;
  caption?: string;
  span: "hero" | "wide" | "tall" | "normal";
}

export interface GalleryPage extends BasePage {
  type: "gallery";
  items: GalleryItem[];
}

export interface ConcoursIntroPage extends BasePage {
  type: "concours-intro";
  details: { label: string; value: string }[];
}

export interface ConditionsProgrammePage extends BasePage {
  type: "conditions-programme";
  conditions: string[];
  programme: { heure: string; label: string }[];
}

export interface CriteresRecompensesPage extends BasePage {
  type: "criteres-recompenses";
  criteres: { label: string; points: number }[];
  recompenses: { rang: string; label: string }[];
}

export interface InscriptionPage extends BasePage {
  type: "inscription";
}

export interface FaqReglementPage extends BasePage {
  type: "faq-reglement";
  faq: { question: string; reponse: string }[];
  reglementUrl?: string;
}

export interface ResultatsPage extends BasePage {
  type: "resultats";
}

export type Page =
  | CoverPage
  | StoryPage
  | ProductsPage
  | CraftPage
  | GalleryPage
  | ConcoursIntroPage
  | ConditionsProgrammePage
  | CriteresRecompensesPage
  | InscriptionPage
  | FaqReglementPage
  | ResultatsPage;
