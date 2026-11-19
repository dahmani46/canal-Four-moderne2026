import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

/**
 * Comptes de démonstration pour tester chaque espace privé.
 * Ce sont des identifiants de développement, pas des personnes réelles —
 * à remplacer/recréer via l'administration générale (Phase D) avant mise en production.
 */
const DEMO_USERS = [
  { email: "patisserie@lefourducanal.demo", password: "Demo-Patisserie-2026", role: "admin_patisserie", nom: "Admin Pâtisserie (démo)" },
  { email: "jury1@lefourducanal.demo", password: "Demo-Jury-2026", role: "jury", nom: "Juré 1 (démo)" },
  { email: "general@lefourducanal.demo", password: "Demo-General-2026", role: "admin_general", nom: "Admin Générale (démo)" },
] as const;

async function main() {
  await prisma.concoursConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      placesMax: 20,
      dateCloture: new Date("2026-12-02T23:59:59"),
      resultatsPublies: false,
    },
  });

  for (const user of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash, role: user.role, nom: user.nom },
      create: { email: user.email, passwordHash, role: user.role, nom: user.nom },
    });
  }

  console.log("Seed terminé.");
  console.log("Comptes de démonstration :");
  for (const user of DEMO_USERS) {
    console.log(`  [${user.role}] ${user.email} / ${user.password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
