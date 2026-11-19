export const STATUTS = ["confirmee", "attente", "refusee"] as const;
export type Statut = (typeof STATUTS)[number];

export function statutLabel(statut: string): string {
  switch (statut) {
    case "confirmee":
      return "Validée";
    case "attente":
      return "En attente";
    case "refusee":
      return "Refusée";
    default:
      return statut;
  }
}

export function statutBadgeClass(statut: string): string {
  switch (statut) {
    case "confirmee":
      return "bg-green-50 text-green-800";
    case "attente":
      return "bg-amber-50 text-amber-800";
    case "refusee":
      return "bg-red-50 text-red-800";
    default:
      return "bg-ink/5 text-ink/60";
  }
}
