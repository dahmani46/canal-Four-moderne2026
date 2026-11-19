"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PrepareNotificationButton({
  participantId,
  type,
  label,
}: {
  participantId: string;
  type: "confirmation" | "rappel";
  label: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
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

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={handleClick}
        className="rounded-full border border-bordeaux/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-bordeaux transition hover:bg-bordeaux hover:text-cream disabled:opacity-40"
      >
        {loading ? "…" : label}
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
