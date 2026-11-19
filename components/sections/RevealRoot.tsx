"use client";

import type { ReactNode } from "react";
import { useRevealOnScroll } from "@/lib/useRevealOnScroll";

export function RevealRoot({ children }: { children: ReactNode }) {
  const ref = useRevealOnScroll<HTMLElement>();
  return <main ref={ref}>{children}</main>;
}
