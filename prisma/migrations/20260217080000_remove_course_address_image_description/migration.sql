-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_CourseCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "courseDate" DATETIME NOT NULL,
    "courseTypeId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxCapacity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "CourseCatalog_courseTypeId_fkey" FOREIGN KEY ("courseTypeId") REFERENCES "CourseType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_CourseCatalog" ("id", "title", "slug", "courseDate", "courseTypeId", "isActive", "maxCapacity", "createdAt", "updatedAt", "deletedAt")
SELECT "id", "title", "slug", "courseDate", "courseTypeId", "isActive", "maxCapacity", "createdAt", "updatedAt", "deletedAt" FROM "CourseCatalog";

DROP TABLE "CourseCatalog";
ALTER TABLE "new_CourseCatalog" RENAME TO "CourseCatalog";

CREATE UNIQUE INDEX "CourseCatalog_slug_key" ON "CourseCatalog"("slug");
CREATE INDEX "CourseCatalog_courseDate_idx" ON "CourseCatalog"("courseDate");
CREATE INDEX "CourseCatalog_isActive_courseDate_idx" ON "CourseCatalog"("isActive", "courseDate");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
