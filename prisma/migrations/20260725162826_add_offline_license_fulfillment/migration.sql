-- CreateEnum
CREATE TYPE "LicensePlan" AS ENUM ('THREE_MONTH', 'SIX_MONTH', 'ONE_YEAR');

-- CreateEnum
CREATE TYPE "LicenseRequestStatus" AS ENUM ('PENDING', 'FULFILLED', 'FAILED');

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "licenseApiKey" TEXT,
ADD COLUMN     "licenseApiUrl" TEXT,
ADD COLUMN     "licenseDownloadUrl" TEXT,
ADD COLUMN     "licensePlan1YrPrice" INTEGER,
ADD COLUMN     "licensePlan3MoPrice" INTEGER,
ADD COLUMN     "licensePlan6MoPrice" INTEGER;

-- CreateTable
CREATE TABLE "license_requests" (
    "id" TEXT NOT NULL,
    "plan" "LicensePlan" NOT NULL,
    "machineId" TEXT NOT NULL,
    "status" "LicenseRequestStatus" NOT NULL DEFAULT 'PENDING',
    "licenseId" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leadId" TEXT NOT NULL,

    CONSTRAINT "license_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "license_requests_leadId_key" ON "license_requests"("leadId");

-- AddForeignKey
ALTER TABLE "license_requests" ADD CONSTRAINT "license_requests_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
