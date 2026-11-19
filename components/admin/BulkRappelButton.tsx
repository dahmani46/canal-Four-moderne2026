"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BulkRappelButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "rappel", bulk: true }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(body.message ?? "Une erreur est survenue.");
        return;
      }
      setMessage(
        `${body.created} rappel(s) préparé(s)${body.skipped ? `, ${body.skipped} déjà en attente ignoré(s)` : ""}.`
      );
      router.refresh();
    } catch {
      setMessage("Erreur réseau, réessayez.");
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
        className="rounded-full border border-bordeaux/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-bordeaux transition hover:bg-bordeaux hover:text-cream disabled:opacity-40"
      >
        {loading ? "…" : "Préparer les rappels pour tous les confirmés"}
      </button>
      {message && <p className="text-xs text-ink/60">{message}</p>}
    </div>
  );
}
