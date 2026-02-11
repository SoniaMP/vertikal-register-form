-- CreateTable
CREATE TABLE "SupplementV2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "supplementGroupId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupplementV2_supplementGroupId_fkey" FOREIGN KEY ("supplementGroupId") REFERENCES "SupplementGroupV2" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
