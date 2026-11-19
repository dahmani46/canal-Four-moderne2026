"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MarkNotificationSentButton({ notificationId }: { notificationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/notifications/${notificationId}`, { method: "PATCH" });
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
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={handleClick}
        className="rounded-full bg-bordeaux px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark disabled:opacity-40"
      >
        {loading ? "…" : "Marquer comme envoyée"}
      </button>
      <p className="text-[11px] italic text-ink/40">À cocher uniquement après l&apos;envoi réel.</p>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
