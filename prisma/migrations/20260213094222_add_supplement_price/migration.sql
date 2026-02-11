-- CreateTable
CREATE TABLE "SupplementPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seasonId" TEXT NOT NULL,
    "supplementId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "SupplementPrice_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SupplementPrice_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "SupplementV2" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SupplementPrice_seasonId_supplementId_key" ON "SupplementPrice"("seasonId", "supplementId");
