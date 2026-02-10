/*
  Warnings:

  - You are about to drop the column `price` on the `FederationSubtype` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "federationTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoryPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "subtypeId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "CategoryPrice_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CategoryPrice_subtypeId_fkey" FOREIGN KEY ("subtypeId") REFERENCES "FederationSubtype" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SupplementGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "federationTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupplementGroup_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FederationSubtype" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "federationTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FederationSubtype_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FederationSubtype" ("active", "createdAt", "description", "federationTypeId", "id", "name", "updatedAt") SELECT "active", "createdAt", "description", "federationTypeId", "id", "name", "updatedAt" FROM "FederationSubtype";
DROP TABLE "FederationSubtype";
ALTER TABLE "new_FederationSubtype" RENAME TO "FederationSubtype";
CREATE TABLE "new_Registration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "federationTypeId" TEXT NOT NULL,
    "federationSubtypeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Registration_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Registration_federationSubtypeId_fkey" FOREIGN KEY ("federationSubtypeId") REFERENCES "FederationSubtype" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Registration_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Registration" ("address", "city", "confirmationSent", "createdAt", "dateOfBirth", "dni", "email", "federationSubtypeId", "federationTypeId", "firstName", "id", "lastName", "paymentStatus", "phone", "postalCode", "province", "stripePaymentId", "stripeSessionId", "totalAmount", "updatedAt") SELECT "address", "city", "confirmationSent", "createdAt", "dateOfBirth", "dni", "email", "federationSubtypeId", "federationTypeId", "firstName", "id", "lastName", "paymentStatus", "phone", "postalCode", "province", "stripePaymentId", "stripeSessionId", "totalAmount", "updatedAt" FROM "Registration";
DROP TABLE "Registration";
ALTER TABLE "new_Registration" RENAME TO "Registration";
CREATE TABLE "new_Supplement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "federationTypeId" TEXT NOT NULL,
    "supplementGroupId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Supplement_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Supplement_supplementGroupId_fkey" FOREIGN KEY ("supplementGroupId") REFERENCES "SupplementGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Supplement" ("active", "createdAt", "description", "federationTypeId", "id", "name", "price", "updatedAt") SELECT "active", "createdAt", "description", "federationTypeId", "id", "name", "price", "updatedAt" FROM "Supplement";
DROP TABLE "Supplement";
ALTER TABLE "new_Supplement" RENAME TO "Supplement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryPrice_categoryId_subtypeId_key" ON "CategoryPrice"("categoryId", "subtypeId");
