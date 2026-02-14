-- CreateTable
CREATE TABLE "CourseType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "CourseCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "CoursePrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseCatalogId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "saleStart" DATETIME,
    "saleEnd" DATETIME,
    CONSTRAINT "CoursePrice_courseCatalogId_fkey" FOREIGN KEY ("courseCatalogId") REFERENCES "CourseCatalog" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseCatalogId" TEXT NOT NULL,
    "coursePriceId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "courses_courseCatalogId_fkey" FOREIGN KEY ("courseCatalogId") REFERENCES "CourseCatalog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "courses_coursePriceId_fkey" FOREIGN KEY ("coursePriceId") REFERENCES "CoursePrice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CourseCatalog_courseDate_idx" ON "CourseCatalog"("courseDate");

-- CreateIndex
CREATE INDEX "CourseCatalog_isActive_courseDate_idx" ON "CourseCatalog"("isActive", "courseDate");

-- CreateIndex
CREATE INDEX "courses_courseCatalogId_paymentStatus_idx" ON "courses"("courseCatalogId", "paymentStatus");

-- CreateIndex
CREATE INDEX "courses_stripeSessionId_idx" ON "courses"("stripeSessionId");
