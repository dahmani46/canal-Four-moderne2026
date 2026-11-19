import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function AdminGeneralPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">
            Administration générale
          </h1>
          <p className="mt-1 text-sm text-ink/60">Connecté en tant que {session?.nom}</p>
        </div>
        <LogoutButton />
      </div>

      <p className="mt-10 rounded-xl2 border border-dashed border-bordeaux/30 bg-white/60 p-6 text-sm text-ink/70">
        Gestion des utilisateurs et des rôles, des médias et des paramètres du concours (dates,
        nombre de places) arrive dans une prochaine passe (Phase D).
      </p>
    </main>
  );
}
