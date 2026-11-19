-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'a_envoyer',
    "sujet" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "preparedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preparedBy" TEXT NOT NULL,
    "sentAt" DATETIME,
    "sentBy" TEXT,
    CONSTRAINT "Notification_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
