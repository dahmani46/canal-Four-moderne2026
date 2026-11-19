"use client";

import { useEffect, useRef } from "react";

/**
 * Révèle en fondu les éléments portant la classe `.reveal` quand ils entrent
 * dans le viewport. Pur IntersectionObserver : ne capture jamais le scroll,
 * ne retarde jamais l'input — le défilement natif reste toujours immédiat.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const targets = root.matches(".reveal")
      ? [root, ...root.querySelectorAll<HTMLElement>(".reveal")]
      : Array.from(root.querySelectorAll<HTMLElement>(".reveal"));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return containerRef;
}
