-- CreateTable: FederationSubtype
CREATE TABLE "FederationSubtype" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "federationTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FederationSubtype_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Migrate data: create one FederationSubtype per existing FederationType, copying name+price
INSERT INTO "FederationSubtype" ("id", "name", "description", "price", "active", "federationTypeId", "createdAt", "updatedAt")
SELECT
    "id" || '_subtype',
    "name",
    "description",
    "price",
    "active",
    "id",
    "createdAt",
    "updatedAt"
FROM "FederationType";

-- Add federationSubtypeId to Registration (nullable first for data migration)
ALTER TABLE "Registration" ADD COLUMN "federationSubtypeId" TEXT;

-- Set federationSubtypeId for existing registrations based on their federationTypeId
UPDATE "Registration"
SET "federationSubtypeId" = "federationTypeId" || '_subtype';

-- RedefineTables (SQLite doesn't support ALTER COLUMN or DROP COLUMN cleanly)
-- Recreate Registration with NOT NULL federationSubtypeId
PRAGMA foreign_keys=OFF;

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
    "totalAmount" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Registration_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Registration_federationSubtypeId_fkey" FOREIGN KEY ("federationSubtypeId") REFERENCES "FederationSubtype" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Registration" SELECT
    "id", "firstName", "lastName", "email", "phone", "dni", "dateOfBirth",
    "address", "city", "postalCode", "province", "federationTypeId",
    "federationSubtypeId", "totalAmount", "paymentStatus", "stripeSessionId",
    "stripePaymentId", "confirmationSent", "createdAt", "updatedAt"
FROM "Registration";

DROP TABLE "Registration";
ALTER TABLE "new_Registration" RENAME TO "Registration";

-- Recreate FederationType without price column
CREATE TABLE "new_FederationType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_FederationType" ("id", "name", "description", "active", "createdAt", "updatedAt")
SELECT "id", "name", "description", "active", "createdAt", "updatedAt"
FROM "FederationType";

DROP TABLE "FederationType";
ALTER TABLE "new_FederationType" RENAME TO "FederationType";

-- Recreate foreign keys for tables referencing FederationType
-- Supplement table
CREATE TABLE "new_Supplement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "federationTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Supplement_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Supplement" SELECT * FROM "Supplement";
DROP TABLE "Supplement";
ALTER TABLE "new_Supplement" RENAME TO "Supplement";

-- Recreate RegistrationSupplement to re-link foreign keys
CREATE TABLE "new_RegistrationSupplement" (
    "registrationId" TEXT NOT NULL,
    "supplementId" TEXT NOT NULL,
    "priceAtTime" INTEGER NOT NULL,
    PRIMARY KEY ("registrationId", "supplementId"),
    CONSTRAINT "RegistrationSupplement_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RegistrationSupplement_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_RegistrationSupplement" SELECT * FROM "RegistrationSupplement";
DROP TABLE "RegistrationSupplement";
ALTER TABLE "new_RegistrationSupplement" RENAME TO "RegistrationSupplement";

-- Also recreate FederationSubtype to re-link to new FederationType table
CREATE TABLE "new_FederationSubtype" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "federationTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FederationSubtype_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_FederationSubtype" SELECT * FROM "FederationSubtype";
DROP TABLE "FederationSubtype";
ALTER TABLE "new_FederationSubtype" RENAME TO "FederationSubtype";

PRAGMA foreign_keys=ON;
