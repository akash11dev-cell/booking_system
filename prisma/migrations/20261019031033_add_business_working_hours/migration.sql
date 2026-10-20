-- CreateTable
CREATE TABLE "BusinessWorkingHours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT,
    "closeTime" TEXT,
    "businessId" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BusinessWorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessWorkingHours_businessId_idx" ON "BusinessWorkingHours"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessWorkingHours_businessId_dayOfWeek_key" ON "BusinessWorkingHours"("businessId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "BusinessWorkingHours" ADD CONSTRAINT "BusinessWorkingHours_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
