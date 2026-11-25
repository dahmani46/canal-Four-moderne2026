"use client";

import { useState } from "react";
import Image from "next/image";
import type { InscriptionPage as InscriptionPageData } from "@/types/page";

interface FormState {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nomBuche: string;
  composition: string;
  accepteReglement: boolean;
  consentementRGPD: boolean;
}

const EMPTY_FORM: FormState = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  nomBuche: "",
  composition: "",
  accepteReglement: false,
  consentementRGPD: false,
};

type SubmitResult =
  | { kind: "success"; statut: "confirmee" | "attente"; message: string }
  | { kind: "error"; message: string };

export function InscriptionPage({ page }: { page: InscriptionPageData }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const image = page.images?.[0];

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json();

      if (!res.ok) {
        setResult({ kind: "error", message: body.message ?? "Une erreur est survenue." });
      } else {
        setResult({ kind: "success", statut: body.statut, message: body.message });
        setForm(EMPTY_FORM);
      }
    } catch {
      setResult({ kind: "error", message: "Erreur réseau, réessayez." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="inscription" className="reveal w-full bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold-dark">{page.subtitle}</p>
          <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">{page.title}</h2>
          <p className="mx-auto mt-2 max-w-prose font-display text-sm text-ink/70">{page.description}</p>
        </div>

        {image && (
          <div className="relative mt-8 h-48 w-full overflow-hidden rounded-xl2 shadow-soft sm:h-64">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}

        <div className="mt-8 rounded-xl2 bg-white p-6 shadow-soft sm:p-10">
          {result?.kind === "success" ? (
            <div
              className={`rounded-xl2 p-4 text-sm ${
                result.statut === "confirmee" ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
              }`}
            >
              {result.message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Prénom">
                <input required value={form.prenom} onChange={(e) => update("prenom", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Nom">
                <input required value={form.nom} onChange={(e) => update("nom", e.target.value)} className={inputClass} />
              </Field>
              <Field label="E-mail">
                <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Téléphone">
                <input required value={form.telephone} onChange={(e) => update("telephone", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Nom de la bûche" full>
                <input required value={form.nomBuche} onChange={(e) => update("nomBuche", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Composition de la bûche" full>
                <textarea
                  required
                  rows={3}
                  value={form.composition}
                  onChange={(e) => update("composition", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <label className="col-span-full flex items-start gap-2 text-xs text-ink/70">
                <input
                  type="checkbox"
                  required
                  checked={form.accepteReglement}
                  onChange={(e) => update("accepteReglement", e.target.checked)}
                  className="mt-0.5"
                />
                J&apos;accepte le règlement du concours.
              </label>
              <label className="col-span-full flex items-start gap-2 text-xs text-ink/70">
                <input
                  type="checkbox"
                  required
                  checked={form.consentementRGPD}
                  onChange={(e) => update("consentementRGPD", e.target.checked)}
                  className="mt-0.5"
                />
                Je consens à l&apos;utilisation de mes données pour la gestion du concours (RGPD).
              </label>

              {result?.kind === "error" && (
                <p className="col-span-full text-sm text-red-700">{result.message}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="col-span-full mt-2 rounded-full bg-bordeaux px-6 py-2.5 text-sm uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark disabled:opacity-50"
              >
                {submitting ? "Envoi…" : "S'inscrire"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-bordeaux";

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block text-xs text-ink/70 ${full ? "col-span-full" : ""}`}>
      {label}
      {children}
    </label>
  );
}
