/*
  Warnings:

  - Added the required column `slug` to the `CourseCatalog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN "address" TEXT;
ALTER TABLE "courses" ADD COLUMN "city" TEXT;
ALTER TABLE "courses" ADD COLUMN "dateOfBirth" TEXT;
ALTER TABLE "courses" ADD COLUMN "dni" TEXT;
ALTER TABLE "courses" ADD COLUMN "licenseFileUrl" TEXT;
ALTER TABLE "courses" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "courses" ADD COLUMN "province" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "courseDate" DATETIME NOT NULL,
    "courseTypeId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "placeId" TEXT,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxCapacity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "CourseCatalog_courseTypeId_fkey" FOREIGN KEY ("courseTypeId") REFERENCES "CourseType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CourseCatalog" ("slug", "address", "courseDate", "courseTypeId", "createdAt", "deletedAt", "description", "id", "image", "isActive", "lat", "lng", "maxCapacity", "placeId", "title", "updatedAt") SELECT LOWER(REPLACE(REPLACE(REPLACE("title", ' ', '-'), 'ñ', 'n'), 'á', 'a')), "address", "courseDate", "courseTypeId", "createdAt", "deletedAt", "description", "id", "image", "isActive", "lat", "lng", "maxCapacity", "placeId", "title", "updatedAt" FROM "CourseCatalog";
DROP TABLE "CourseCatalog";
ALTER TABLE "new_CourseCatalog" RENAME TO "CourseCatalog";
CREATE UNIQUE INDEX "CourseCatalog_slug_key" ON "CourseCatalog"("slug");
CREATE INDEX "CourseCatalog_courseDate_idx" ON "CourseCatalog"("courseDate");
CREATE INDEX "CourseCatalog_isActive_courseDate_idx" ON "CourseCatalog"("isActive", "courseDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
