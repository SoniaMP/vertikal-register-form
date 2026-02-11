-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "seasonId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "federationTypeId" TEXT NOT NULL,
    "federationSubtypeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isFederated" BOOLEAN NOT NULL DEFAULT false,
    "totalAmount" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "consentedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Membership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Membership_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Membership_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_federationSubtypeId_fkey" FOREIGN KEY ("federationSubtypeId") REFERENCES "FederationSubtype" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Membership" ("categoryId", "confirmationSent", "consentedAt", "createdAt", "federationSubtypeId", "federationTypeId", "id", "isFederated", "memberId", "paymentStatus", "status", "stripePaymentId", "stripeSessionId", "totalAmount", "updatedAt", "year") SELECT "categoryId", "confirmationSent", "consentedAt", "createdAt", "federationSubtypeId", "federationTypeId", "id", "isFederated", "memberId", "paymentStatus", "status", "stripePaymentId", "stripeSessionId", "totalAmount", "updatedAt", "year" FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
CREATE INDEX "Membership_year_status_idx" ON "Membership"("year", "status");
CREATE INDEX "Membership_year_paymentStatus_idx" ON "Membership"("year", "paymentStatus");
CREATE INDEX "Membership_stripeSessionId_idx" ON "Membership"("stripeSessionId");
CREATE UNIQUE INDEX "Membership_memberId_year_key" ON "Membership"("memberId", "year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
