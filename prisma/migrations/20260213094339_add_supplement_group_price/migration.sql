-- CreateTable
CREATE TABLE "SupplementGroupPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seasonId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "SupplementGroupPrice_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SupplementGroupPrice_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SupplementGroupV2" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SupplementGroupPrice_seasonId_groupId_key" ON "SupplementGroupPrice"("seasonId", "groupId");
