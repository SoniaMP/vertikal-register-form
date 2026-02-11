/*
  Warnings:

  - You are about to drop the `CategoryPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryV2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `federationTypeId` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CategoryPrice_categoryId_subtypeId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CategoryPrice";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CategoryV2";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Category" ("active", "createdAt", "description", "id", "name", "updatedAt") SELECT "active", "createdAt", "description", "id", "name", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_LicenseOffering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seasonId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "subtypeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "LicenseOffering_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LicenseOffering_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "LicenseType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LicenseOffering_subtypeId_fkey" FOREIGN KEY ("subtypeId") REFERENCES "LicenseSubtype" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LicenseOffering_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LicenseOffering" ("categoryId", "id", "price", "seasonId", "subtypeId", "typeId") SELECT "categoryId", "id", "price", "seasonId", "subtypeId", "typeId" FROM "LicenseOffering";
DROP TABLE "LicenseOffering";
ALTER TABLE "new_LicenseOffering" RENAME TO "LicenseOffering";
CREATE UNIQUE INDEX "LicenseOffering_seasonId_typeId_subtypeId_categoryId_key" ON "LicenseOffering"("seasonId", "typeId", "subtypeId", "categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
