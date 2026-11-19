export interface ContestWinner {
  rang: string;
  nom: string;
  photo?: { src: string; alt: string };
  creationNom: string;
  creationPhoto?: { src: string; alt: string };
  description?: string;
  composition?: string;
  prix: string;
}

export interface ContestEdition {
  annee: number;
  winners: ContestWinner[];
}
