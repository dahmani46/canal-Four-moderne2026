import type { Page } from "@/types/page";
import { demoProducts } from "./products";

/**
 * Prototype à 4 feuillets : couverture + 3 pages de contenu.
 * Les types de page (galerie, contact, footer) sont déjà modélisés dans
 * types/page.ts pour les itérations suivantes, mais pas encore instanciés ici.
 */
export const pages: Page[] = [
  {
    id: "cover",
    order: 0,
    type: "cover",
    title: "CANAL-FOUR",
    subtitle: "Pâtisserie artisanale",
    description: "L'art de la gourmandise, le goût de l'exception.",
    theme: "dark",
    videos: [
      {
        // Pas de fichier vidéo réel fourni pour le moment : la couverture
        // utilise un effet Ken Burns sur cette image en attendant un vrai
        // plan vidéo (composant <CoverPage> déjà prêt à recevoir une src).
        src: "",
        poster: "/images/image5.jpg",
        loop: true,
        muted: true,
        autoPlay: true,
      },
    ],
    images: [{ src: "/images/image5.jpg", alt: "Entremet chocolat flambé, pâtisserie CANAL-FOUR" }],
    cta: { label: "Ouvrir le livre", targetPageId: "histoire" },
  },
  {
    id: "histoire",
    order: 1,
    type: "story",
    title: "Notre histoire",
    subtitle: "Un savoir-faire transmis avec passion",
    description:
      "Depuis sa première vitrine, CANAL-FOUR cultive un goût pour la pâtisserie française exigeante : des produits de saison, un travail artisanal et une attention portée à chaque détail, du feuilletage au dressage.",
    theme: "cream",
    images: [
      { src: "/images/image1.jpg", alt: "Intérieur de la boutique CANAL-FOUR, vitrine et salon de thé" },
      { src: "/images/image2.jpg", alt: "Chef pâtissier finalisant une création en cuisine" },
    ],
    milestones: [
      { year: "Démo", label: "Ouverture de l'atelier" },
      { year: "Démo", label: "Premières créations signature" },
      { year: "Démo", label: "Agrandissement de la boutique" },
    ],
  },
  {
    id: "creations",
    order: 2,
    type: "products",
    title: "Nos créations",
    subtitle: "Un aperçu de notre gamme",
    description:
      "Viennoiseries et pièces individuelles : deux exemples de fiches produit, à titre de démonstration.",
    theme: "cream",
    products: demoProducts,
  },
  {
    id: "savoir-faire",
    order: 3,
    type: "craft",
    title: "Notre savoir-faire",
    subtitle: "La précision d'un geste artisanal",
    description:
      "Du feuilletage à la main à la mise au point des ganaches, chaque étape répond à une exigence de précision et de régularité — exemples illustrant notre méthode de travail.",
    theme: "bordeaux",
    images: [
      { src: "/images/image4.jpg", alt: "Façonnage de la pâte feuilletée pour les croissants" },
      { src: "/images/image2.jpg", alt: "Finition minutieuse d'une pièce pâtissière" },
    ],
    steps: [
      {
        title: "Sélection des ingrédients",
        description: "Farine de tradition, beurre AOP, fruits de saison (exemple de contenu).",
        image: { src: "/images/image4.jpg", alt: "Façonnage de la pâte feuilletée" },
      },
      {
        title: "Façonnage artisanal",
        description: "Chaque pièce est travaillée à la main, du feuilletage au dressage (exemple de contenu).",
        image: { src: "/images/image2.jpg", alt: "Dressage minutieux d'une pâtisserie" },
      },
      {
        title: "Finition et contrôle",
        description: "Un dernier regard avant la mise en vitrine (exemple de contenu).",
        image: { src: "/images/image5.jpg", alt: "Finition d'un entremet chocolat" },
      },
    ],
  },
  {
    id: "concours-intro",
    order: 4,
    type: "concours-intro",
    title: "Le Concours de la Bûche de Noël",
    subtitle: "Le Four du Canal",
    description:
      "Pâtissiers amateurs, venez relever le défi de la plus belle bûche de Noël et la faire déguster à l'aveugle par notre jury, en boutique.",
    theme: "bordeaux",
    images: [
      { src: "/images/10_photos_le_four_du_canal/01_photo_four_du_canal.png", alt: "Bûche de Noël au chocolat, dressée pour la dégustation" },
      { src: "/images/10_photos_le_four_du_canal/02_photo_four_du_canal.png", alt: "Bûches de Noël en vitrine, décor de fêtes" },
    ],
    details: [
      { label: "Date", value: "Samedi 5 décembre 2026" },
      { label: "Lieu", value: "À la boutique" },
      { label: "Participants", value: "20 places maximum" },
      { label: "Inscription", value: "Gratuite" },
    ],
  },
  {
    id: "conditions-programme",
    order: 5,
    type: "conditions-programme",
    title: "Conditions & Programme",
    subtitle: "Comment participer",
    theme: "cream",
    images: [
      { src: "/images/10_photos_le_four_du_canal/04_photo_four_du_canal.png", alt: "Pâtissier décorant une bûche de Noël pour le concours" },
    ],
    conditions: [
      "Inscription gratuite, ouverte dans la limite de 20 places.",
      "Clôture des inscriptions le 2 décembre 2026, ou dès que les 20 places sont prises.",
      "Dépôt de la bûche à la boutique entre 9h et 10h le jour du concours.",
      "Dégustation à l'aveugle par un jury de trois personnes.",
    ],
    programme: [
      { heure: "9h – 10h", label: "Dépôt des bûches" },
      { heure: "14h", label: "Dégustation à l'aveugle par le jury" },
      { heure: "16h30", label: "Remise des prix" },
    ],
  },
  {
    id: "criteres-recompenses",
    order: 6,
    type: "criteres-recompenses",
    title: "Critères & Récompenses",
    subtitle: "Comment les bûches sont notées",
    theme: "bordeaux",
    images: [
      { src: "/images/10_photos_le_four_du_canal/05_photo_four_du_canal.png", alt: "Trois jurés dégustant les bûches à l'aveugle" },
    ],
    criteres: [
      { label: "Goût", points: 20 },
      { label: "Technique et texture", points: 10 },
      { label: "Visuel", points: 10 },
      { label: "Originalité et respect du thème", points: 10 },
    ],
    recompenses: [
      { rang: "1er prix", label: "Atelier privé avec le chef pâtissier + bon d'achat de 100 €" },
      { rang: "2e et 3e prix", label: "Assortiment d'épicerie fine + livre de recettes" },
    ],
  },
  {
    id: "galerie",
    order: 7,
    type: "gallery",
    title: "Galerie",
    subtitle: "La bûche, étape par étape",
    theme: "cream",
    items: [
      {
        image: { src: "/images/10_photos_le_four_du_canal/06_photo_four_du_canal.png", alt: "Vitrine de Noël avec plusieurs bûches et pâtisseries" },
        caption: "La vitrine de Noël",
        span: "hero",
      },
      {
        image: { src: "/images/10_photos_le_four_du_canal/07_photo_four_du_canal.png", alt: "Les ingrédients de la bûche : œufs, farine, beurre, chocolat" },
        span: "normal",
      },
      {
        image: { src: "/images/10_photos_le_four_du_canal/08_photo_four_du_canal.png", alt: "Préparation du biscuit roulé au fouet" },
        span: "normal",
      },
      {
        image: { src: "/images/10_photos_le_four_du_canal/09_photo_four_du_canal.png", alt: "La bûche de Noël finale décorée" },
        span: "tall",
      },
      {
        image: { src: "/images/10_photos_le_four_du_canal/10_photo_four_du_canal.png", alt: "Part de bûche de Noël prête pour le concours" },
        span: "wide",
      },
    ],
  },
  {
    id: "inscription",
    order: 8,
    type: "inscription",
    title: "Inscription",
    subtitle: "Participez au concours",
    description: "Les places sont limitées à 20 participants — inscrivez-vous dès maintenant.",
    theme: "cream",
    images: [
      { src: "/images/10_photos_le_four_du_canal/03_photo_four_du_canal.png", alt: "Bulletin d'inscription au concours, toque de pâtissier" },
    ],
  },
  {
    id: "faq-reglement",
    order: 9,
    type: "faq-reglement",
    title: "FAQ & Règlement",
    subtitle: "Questions fréquentes et confidentialité",
    theme: "bordeaux",
    faq: [
      { question: "L'inscription est-elle payante ?", reponse: "Non, l'inscription au concours est entièrement gratuite." },
      { question: "Combien de places sont disponibles ?", reponse: "20 places au total. Au-delà, les inscriptions passent en liste d'attente." },
      { question: "Jusqu'à quand puis-je m'inscrire ?", reponse: "Jusqu'au 2 décembre 2026, ou plus tôt si les 20 places sont prises." },
      { question: "Comment se déroule la dégustation ?", reponse: "À l'aveugle, par un jury de trois personnes, à 14h le jour du concours." },
    ],
  },
  {
    id: "resultats",
    order: 10,
    type: "resultats",
    title: "Résultats",
    subtitle: "Le palmarès du concours",
    theme: "cream",
  },
];
