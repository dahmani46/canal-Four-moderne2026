import type { Page } from "@/types/page";
import { StoryPage } from "@/components/pages-content/StoryPage";
import { ProductsGridPage } from "@/components/pages-content/ProductsGridPage";
import { CraftPage } from "@/components/pages-content/CraftPage";
import { GalleryMosaicPage } from "@/components/pages-content/GalleryMosaicPage";
import { ConditionsProgrammePage } from "@/components/pages-content/ConditionsProgrammePage";
import { CriteresRecompensesPage } from "@/components/pages-content/CriteresRecompensesPage";
import { InscriptionPage } from "@/components/pages-content/InscriptionPage";
import { FaqReglementPage } from "@/components/pages-content/FaqReglementPage";
import { ResultatsPage } from "@/components/pages-content/ResultatsPage";

export function SectionContent({ page }: { page: Page }) {
  switch (page.type) {
    case "story":
      return <StoryPage page={page} />;
    case "products":
      return <ProductsGridPage page={page} />;
    case "craft":
      return <CraftPage page={page} />;
    case "gallery":
      return <GalleryMosaicPage page={page} />;
    case "conditions-programme":
      return <ConditionsProgrammePage page={page} />;
    case "criteres-recompenses":
      return <CriteresRecompensesPage page={page} />;
    case "inscription":
      return <InscriptionPage page={page} />;
    case "faq-reglement":
      return <FaqReglementPage page={page} />;
    case "resultats":
      return <ResultatsPage page={page} />;
    case "cover":
    case "concours-intro":
      return null; // rendues par <Hero/> directement
    default:
      return null;
  }
}
