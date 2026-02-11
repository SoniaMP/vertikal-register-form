-- CreateTable
CREATE TABLE "LicenseOffering" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seasonId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "subtypeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "LicenseOffering_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LicenseOffering_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "LicenseType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LicenseOffering_subtypeId_fkey" FOREIGN KEY ("subtypeId") REFERENCES "LicenseSubtype" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LicenseOffering_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryV2" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LicenseOffering_seasonId_typeId_subtypeId_categoryId_key" ON "LicenseOffering"("seasonId", "typeId", "subtypeId", "categoryId");
