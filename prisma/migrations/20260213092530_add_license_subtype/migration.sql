-- CreateTable
CREATE TABLE "LicenseSubtype" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "licenseTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LicenseSubtype_licenseTypeId_fkey" FOREIGN KEY ("licenseTypeId") REFERENCES "LicenseType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
