/*
  Warnings:

  - You are about to drop the `SupplementGroupV2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupplementV2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `federationTypeId` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Supplement` table. All the data in the column will be lost.
  - You are about to drop the column `federationTypeId` on the `SupplementGroup` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `SupplementGroup` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SupplementGroupV2";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SupplementV2";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Supplement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "supplementGroupId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Supplement_supplementGroupId_fkey" FOREIGN KEY ("supplementGroupId") REFERENCES "SupplementGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Supplement" ("active", "createdAt", "description", "id", "name", "supplementGroupId", "updatedAt") SELECT "active", "createdAt", "description", "id", "name", "supplementGroupId", "updatedAt" FROM "Supplement";
DROP TABLE "Supplement";
ALTER TABLE "new_Supplement" RENAME TO "Supplement";
CREATE TABLE "new_SupplementGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SupplementGroup" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "SupplementGroup";
DROP TABLE "SupplementGroup";
ALTER TABLE "new_SupplementGroup" RENAME TO "SupplementGroup";
CREATE TABLE "new_SupplementGroupPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seasonId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "SupplementGroupPrice_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SupplementGroupPrice_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SupplementGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SupplementGroupPrice" ("groupId", "id", "price", "seasonId") SELECT "groupId", "id", "price", "seasonId" FROM "SupplementGroupPrice";
DROP TABLE "SupplementGroupPrice";
ALTER TABLE "new_SupplementGroupPrice" RENAME TO "SupplementGroupPrice";
CREATE UNIQUE INDEX "SupplementGroupPrice_seasonId_groupId_key" ON "SupplementGroupPrice"("seasonId", "groupId");
CREATE TABLE "new_SupplementPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seasonId" TEXT NOT NULL,
    "supplementId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "SupplementPrice_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SupplementPrice_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SupplementPrice" ("id", "price", "seasonId", "supplementId") SELECT "id", "price", "seasonId", "supplementId" FROM "SupplementPrice";
DROP TABLE "SupplementPrice";
ALTER TABLE "new_SupplementPrice" RENAME TO "SupplementPrice";
CREATE UNIQUE INDEX "SupplementPrice_seasonId_supplementId_key" ON "SupplementPrice"("seasonId", "supplementId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
