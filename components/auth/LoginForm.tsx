"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Role } from "@/lib/auth";

interface LoginFormProps {
  role: Role;
  title: string;
  homePath: string;
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Suspense>
      <LoginFormInner {...props} />
    </Suspense>
  );
}

function LoginFormInner({ role, title, homePath }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message ?? "Identifiants incorrects.");
        setLoading(false);
        return;
      }
      const redirectTo = searchParams.get("redirectTo") ?? homePath;
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Erreur réseau, réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl2 bg-white p-8 shadow-soft"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-bordeaux">{title}</h1>

        <label className="mt-6 block text-sm text-ink/70">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink outline-none focus:border-bordeaux"
          />
        </label>

        <label className="mt-4 block text-sm text-ink/70">
          Mot de passe
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-ink outline-none focus:border-bordeaux"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-bordeaux px-4 py-2 text-sm uppercase tracking-[0.2em] text-cream transition hover:bg-bordeaux-dark disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
