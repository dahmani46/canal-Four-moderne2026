import type { Participant } from "@prisma/client";

/**
 * Textes de notification — infos reprises mot pour mot de data/pages.ts
 * ("concours-intro", "conditions-programme") pour ne jamais diverger des
 * dates/horaires déjà validés. À resynchroniser manuellement si ces pages
 * changent.
 */
const LIEU = "à la boutique";
const DATE_CONCOURS = "samedi 5 décembre 2026";
const DEPOT = "entre 9h et 10h";
const DEGUSTATION = "14h";
const REMISE_PRIX = "16h30";

export interface NotificationMessage {
  sujet: string;
  contenu: string;
}

export function buildConfirmationMessage(participant: Participant): NotificationMessage {
  return {
    sujet: "Confirmation de votre inscription — Concours de la Bûche de Noël, Le Four du Canal",
    contenu: `Bonjour ${participant.prenom},

Votre inscription au Concours de la Bûche de Noël du Four du Canal est confirmée.

Récapitulatif :
- Bûche inscrite : ${participant.nomBuche}
- Dépôt de votre bûche : le ${DATE_CONCOURS}, ${DEPOT}, ${LIEU}.
- Dégustation à l'aveugle par notre jury : à ${DEGUSTATION}.
- Remise des prix : à ${REMISE_PRIX}.

Merci de vous présenter avec votre bûche dans les horaires indiqués. À très bientôt !

L'équipe du Four du Canal`,
  };
}

export function buildRappelMessage(participant: Participant): NotificationMessage {
  return {
    sujet: `Rappel — Concours de la Bûche de Noël, ${DATE_CONCOURS}`,
    contenu: `Bonjour ${participant.prenom},

Un rappel amical : le Concours de la Bûche de Noël du Four du Canal a lieu le ${DATE_CONCOURS}, ${LIEU}.

- Dépôt de votre bûche (${participant.nomBuche}) : ${DEPOT}.
- Dégustation à l'aveugle par le jury : à ${DEGUSTATION}.
- Remise des prix : à ${REMISE_PRIX}.

Nous avons hâte de découvrir votre création !

L'équipe du Four du Canal`,
  };
}
