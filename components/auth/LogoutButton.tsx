"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-bordeaux/30 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-bordeaux transition hover:bg-bordeaux hover:text-cream"
    >
      Se déconnecter
    </button>
  );
}
