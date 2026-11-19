import type { Note, Participant } from "@prisma/client";

/**
 * Barème validé (voir data/pages.ts "criteres-recompenses" et le modèle
 * Prisma Note) : Goût /20, Technique et texture /10, Visuel /10,
 * Originalité et respect du thème /10 — total /50 par juré.
 */
export const CRITERES = [
  { key: "gout", label: "Goût", max: 20 },
  { key: "techniqueTexture", label: "Technique et texture", max: 10 },
  { key: "visuel", label: "Visuel", max: 10 },
  { key: "originalite", label: "Originalité et respect du thème", max: 10 },
] as const;

export type CritereKey = (typeof CRITERES)[number]["key"];

export const TOTAL_MAX = CRITERES.reduce((sum, c) => sum + c.max, 0);

export function noteTotal(note: Pick<Note, CritereKey>): number {
  return note.gout + note.techniqueTexture + note.visuel + note.originalite;
}

export interface ClassementEntry {
  participant: Participant;
  nbNotes: number;
  moyenneTotal: number | null;
  moyennes: Record<CritereKey, number | null>;
  rang: number | null;
}

export function computeClassement(participants: Participant[], notes: Note[]): ClassementEntry[] {
  const notesByParticipant = new Map<string, Note[]>();
  for (const note of notes) {
    const list = notesByParticipant.get(note.participantId) ?? [];
    list.push(note);
    notesByParticipant.set(note.participantId, list);
  }

  const entries: ClassementEntry[] = participants.map((participant) => {
    const participantNotes = notesByParticipant.get(participant.id) ?? [];
    const nbNotes = participantNotes.length;

    const average = (key: CritereKey): number | null =>
      nbNotes === 0 ? null : participantNotes.reduce((sum, n) => sum + n[key], 0) / nbNotes;

    const moyennes = {
      gout: average("gout"),
      techniqueTexture: average("techniqueTexture"),
      visuel: average("visuel"),
      originalite: average("originalite"),
    };

    const moyenneTotal =
      nbNotes === 0 ? null : participantNotes.reduce((sum, n) => sum + noteTotal(n), 0) / nbNotes;

    return { participant, nbNotes, moyenneTotal, moyennes, rang: null };
  });

  const notes_ = entries
    .filter((e): e is ClassementEntry & { moyenneTotal: number } => e.moyenneTotal !== null)
    .sort((a, b) => b.moyenneTotal - a.moyenneTotal);
  notes_.forEach((entry, index) => {
    entry.rang = index + 1;
  });

  const nonNotes = entries.filter((e) => e.moyenneTotal === null);

  return [...notes_, ...nonNotes];
}
