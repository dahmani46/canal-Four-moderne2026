"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin-general/notes/${noteId}`, { method: "DELETE" });
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

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={handleClick}
        className="text-xs uppercase tracking-[0.15em] text-red-700 underline hover:text-red-900 disabled:opacity-40"
      >
        {loading ? "…" : "Supprimer (re-saisie)"}
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
