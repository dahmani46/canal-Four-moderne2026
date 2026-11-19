-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "nomBuche" TEXT NOT NULL,
    "composition" TEXT NOT NULL,
    "accepteReglement" BOOLEAN NOT NULL,
    "consentementRGPD" BOOLEAN NOT NULL,
    "statut" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "juryUserId" TEXT NOT NULL,
    "gout" INTEGER NOT NULL,
    "techniqueTexture" INTEGER NOT NULL,
    "visuel" INTEGER NOT NULL,
    "originalite" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Note_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConcoursConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "placesMax" INTEGER NOT NULL DEFAULT 20,
    "dateCloture" DATETIME NOT NULL,
    "resultatsPublies" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Note_participantId_juryUserId_key" ON "Note"("participantId", "juryUserId");
