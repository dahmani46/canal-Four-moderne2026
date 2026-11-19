"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const EMPTY = { nom: "", email: "", password: "" };

export function CreateJuryForm() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin-general/jury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? "Une erreur est survenue.");
        return;
      }
      setForm(EMPTY);
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Erreur réseau, réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col text-xs text-ink/60">
        Nom
        <input
          required
          value={form.nom}
          onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
          className="mt-1 w-48 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux"
        />
      </label>
      <label className="flex flex-col text-xs text-ink/60">
        E-mail
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="mt-1 w-56 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux"
        />
      </label>
      <label className="flex flex-col text-xs text-ink/60">
        Mot de passe
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="mt-1 w-40 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-bordeaux px-5 py-2 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark disabled:opacity-40"
      >
        {submitting ? "…" : "Créer le compte"}
      </button>
      {success && <p className="text-xs text-green-700">Compte juré créé.</p>}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </form>
  );
}
