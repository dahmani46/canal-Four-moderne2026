"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CRITERES } from "@/lib/classement";

type Scores = { gout: number; techniqueTexture: number; visuel: number; originalite: number };

const EMPTY: Scores = { gout: 0, techniqueTexture: 0, visuel: 0, originalite: 0 };

export function NoteForm({
  participantId,
  initial,
}: {
  participantId: string;
  initial: Scores | null;
}) {
  const router = useRouter();
  const [scores, setScores] = useState<Scores>(initial ?? EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function update(key: keyof Scores, value: number, max: number) {
    setScores((s) => ({ ...s, [key]: Math.min(Math.max(0, value), max) }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/jury/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, ...scores }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? "Une erreur est survenue.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Erreur réseau, réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  const total = scores.gout + scores.techniqueTexture + scores.visuel + scores.originalite;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      {CRITERES.map((c) => (
        <label key={c.key} className="flex flex-col text-xs text-ink/60">
          {c.label} (/{c.max})
          <input
            type="number"
            min={0}
            max={c.max}
            value={scores[c.key]}
            onChange={(e) => update(c.key, Number(e.target.value), c.max)}
            className="mt-1 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux"
          />
        </label>
      ))}

      <div className="col-span-full flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-sm text-ink/70">
          Total : <span className="font-semibold text-bordeaux">{total}/50</span>
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-bordeaux px-5 py-2 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark disabled:opacity-40"
        >
          {submitting ? "Enregistrement…" : initial ? "Mettre à jour la note" : "Enregistrer la note"}
        </button>
      </div>
      {saved && <p className="col-span-full text-xs text-green-700">Note enregistrée.</p>}
      {error && <p className="col-span-full text-xs text-red-700">{error}</p>}
    </form>
  );
}
