export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  /** Date de publication, format ISO (YYYY-MM-DD). */
  date: string;
  photo?: { src: string; alt: string };
}
