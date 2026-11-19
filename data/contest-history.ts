import type { ContestEdition } from "@/types/contest-edition";

/**
 * Le concours du 5 décembre 2026 est la première édition : il ne peut
 * structurellement pas encore y avoir d'"anciens" gagnants. Volontairement
 * vide — structure prête pour les éditions futures, aucune donnée inventée.
 */
export const contestHistory: ContestEdition[] = [];
