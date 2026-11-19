"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ParticipantOption {
  id: string;
  label: string;
}

export function NotificationComposer({ participants }: { participants: ParticipantOption[] }) {
  const router = useRouter();
  const [participantId, setParticipantId] = useState(participants[0]?.id ?? "");
  const [type, setType] = useState<"confirmation" | "rappel">("confirmation");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!participantId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, type }),
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
      setLoading(false);
    }
  }

  if (participants.length === 0) {
    return <p className="text-sm text-ink/50">Aucun participant validé pour le moment.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col text-xs text-ink/60">
        Participant
        <select
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
          className="mt-1 w-64 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux"
        >
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-xs text-ink/60">
        Type
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "confirmation" | "rappel")}
          className="mt-1 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux"
        >
          <option value="confirmation">Confirmation d&apos;inscription</option>
          <option value="rappel">Rappel du concours</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-bordeaux px-5 py-2 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark disabled:opacity-40"
      >
        {loading ? "…" : "Préparer"}
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </form>
  );
}
