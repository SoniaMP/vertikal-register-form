-- CreateTable
CREATE TABLE "FederationType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FederationSubtype" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "federationTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FederationSubtype_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplement" (
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
CREATE TABLE "Registration" (
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
    "isFederated" BOOLEAN NOT NULL DEFAULT false,
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "consentedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Registration_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Registration_federationSubtypeId_fkey" FOREIGN KEY ("federationSubtypeId") REFERENCES "FederationSubtype" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Registration_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegistrationSupplement" (
    "registrationId" TEXT NOT NULL,
    "supplementId" TEXT NOT NULL,
    "priceAtTime" INTEGER NOT NULL,

    PRIMARY KEY ("registrationId", "supplementId"),
    CONSTRAINT "RegistrationSupplement_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RegistrationSupplement_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dni" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
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
    CONSTRAINT "Membership_federationTypeId_fkey" FOREIGN KEY ("federationTypeId") REFERENCES "FederationType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_federationSubtypeId_fkey" FOREIGN KEY ("federationSubtypeId") REFERENCES "FederationSubtype" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MembershipSupplement" (
    "membershipId" TEXT NOT NULL,
    "supplementId" TEXT NOT NULL,
    "priceAtTime" INTEGER NOT NULL,

    PRIMARY KEY ("membershipId", "supplementId"),
    CONSTRAINT "MembershipSupplement_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MembershipSupplement_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryPrice_categoryId_subtypeId_key" ON "CategoryPrice"("categoryId", "subtypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_dni_key" ON "Member"("dni");

-- CreateIndex
CREATE INDEX "Member_email_idx" ON "Member"("email");

-- CreateIndex
CREATE INDEX "Member_lastName_firstName_idx" ON "Member"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Membership_year_status_idx" ON "Membership"("year", "status");

-- CreateIndex
CREATE INDEX "Membership_year_paymentStatus_idx" ON "Membership"("year", "paymentStatus");

-- CreateIndex
CREATE INDEX "Membership_stripeSessionId_idx" ON "Membership"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_memberId_year_key" ON "Membership"("memberId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
