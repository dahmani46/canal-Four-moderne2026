"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Statut } from "@/lib/statut";

export function ParticipantActions({ participantId, statut }: { participantId: string; statut: Statut }) {
  const router = useRouter();
  const [loading, setLoading] = useState<Statut | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatut(next: Statut) {
    setLoading(next);
    setError(null);
    try {
      const res = await fetch(`/api/admin/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? "Une erreur est survenue.");
        return;
      }
      router.refresh();
    } catch {
      setError("Erreur réseau, réessayez.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={statut === "confirmee" || loading !== null}
          onClick={() => updateStatut("confirmee")}
          className="rounded-full bg-bordeaux px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark disabled:opacity-40"
        >
          {loading === "confirmee" ? "…" : "Valider"}
        </button>
        <button
          type="button"
          disabled={statut === "refusee" || loading !== null}
          onClick={() => updateStatut("refusee")}
          className="rounded-full border border-red-700/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-700 transition hover:bg-red-700 hover:text-cream disabled:opacity-40"
        >
          {loading === "refusee" ? "…" : "Refuser"}
        </button>
        {statut !== "attente" && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => updateStatut("attente")}
            className="rounded-full border border-ink/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink/60 transition hover:bg-ink/5 disabled:opacity-40"
          >
            {loading === "attente" ? "…" : "Remettre en attente"}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
