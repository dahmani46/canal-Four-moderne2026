import { pages } from "@/data/pages";
import { reviews } from "@/data/reviews";
import { contestHistory } from "@/data/contest-history";
import type { ConcoursIntroPage } from "@/types/page";
import { RevealRoot } from "@/components/sections/RevealRoot";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { SectionContent } from "@/components/sections/SectionContent";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { PastEditionsSection } from "@/components/sections/PastEditionsSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const heroData = pages.find((p): p is ConcoursIntroPage => p.type === "concours-intro");
  const contentPages = pages.filter((p) => p.type !== "cover" && p.type !== "concours-intro");

  return (
    <RevealRoot>
      <Header />

      {heroData && (
        <Hero
          title={heroData.title}
          subtitle={heroData.subtitle ?? ""}
          description={heroData.description ?? ""}
          details={heroData.details}
          videoSrc="/video/gemini_generated_video_1952e0e6.mp4"
          posterSrc="/images/image5.jpg"
        />
      )}

      {contentPages.map((page) => (
        <SectionContent key={page.id} page={page} />
      ))}

      <ReviewsSection reviews={reviews} />
      <PastEditionsSection editions={contestHistory} />

      <Footer />
    </RevealRoot>
  );
}
