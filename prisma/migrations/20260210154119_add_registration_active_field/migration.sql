-- RedefineTables
PRAGMA defer_foreign_keys=ON;
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
    "categoryId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Registration_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Registration_federationSubtypeId_fkey" FOREIGN KEY ("federationSubtypeId") REFERENCES "FederationSubtype" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Registration_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Registration" ("address", "categoryId", "city", "confirmationSent", "createdAt", "dateOfBirth", "dni", "email", "federationSubtypeId", "federationTypeId", "firstName", "id", "lastName", "paymentStatus", "phone", "postalCode", "province", "stripePaymentId", "stripeSessionId", "totalAmount", "updatedAt") SELECT "address", "categoryId", "city", "confirmationSent", "createdAt", "dateOfBirth", "dni", "email", "federationSubtypeId", "federationTypeId", "firstName", "id", "lastName", "paymentStatus", "phone", "postalCode", "province", "stripePaymentId", "stripeSessionId", "totalAmount", "updatedAt" FROM "Registration";
DROP TABLE "Registration";
ALTER TABLE "new_Registration" RENAME TO "Registration";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
