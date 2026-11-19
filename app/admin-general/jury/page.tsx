import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { CreateJuryForm } from "@/components/admin-general/CreateJuryForm";

export const dynamic = "force-dynamic";

export default async function JuryManagementPage() {
  const [jurors, nbConfirmed] = await Promise.all([
    prisma.user.findMany({ where: { role: "jury" }, orderBy: { nom: "asc" } }),
    prisma.participant.count({ where: { statut: "confirmee" } }),
  ]);

  const notesCounts = await Promise.all(
    jurors.map((j) => prisma.note.count({ where: { juryUserId: j.id } }))
  );

  return (
    <main className="min-h-screen bg-cream px-6 py-10 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Le Four du Canal</p>
          <h1 className="font-display text-3xl font-semibold text-bordeaux">Gestion du jury</h1>
          <Link href="/admin-general" className="mt-1 inline-block text-sm text-ink/60 hover:text-bordeaux">
            ← Retour au tableau de bord
          </Link>
        </div>
        <LogoutButton />
      </div>

      <section className="mt-8 rounded-xl2 bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg text-bordeaux">Créer un compte juré</h2>
        <div className="mt-4">
          <CreateJuryForm />
        </div>
      </section>

      <section className="mt-6 overflow-x-auto rounded-xl2 bg-white shadow-soft">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.15em] text-ink/50">
            <tr>
              <th className="px-4 py-3">Juré</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Évaluations soumises</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {jurors.map((j, i) => (
              <tr key={j.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{j.nom}</td>
                <td className="px-4 py-3 text-ink/70">{j.email}</td>
                <td className="px-4 py-3 text-ink/70">
                  {notesCounts[i]}/{nbConfirmed}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin-general/jury/${j.id}`}
                    className="text-xs uppercase tracking-[0.15em] text-bordeaux underline hover:text-bordeaux-dark"
                  >
                    Voir ses notes
                  </Link>
                </td>
              </tr>
            ))}
            {jurors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-ink/50">
                  Aucun juré enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
