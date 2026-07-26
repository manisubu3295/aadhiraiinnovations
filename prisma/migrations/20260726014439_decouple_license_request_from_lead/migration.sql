-- LicenseRequest becomes independent of Lead: leadId is now optional, and the record carries
-- its own customer fields (customerName/email/whatsapp/businessName) so it can be created
-- manually by staff with no Lead involved. Existing rows are backfilled from their linked Lead
-- before customerName/email are made required, since this runs against a database that may
-- already have real rows.

-- DropForeignKey
ALTER TABLE "license_requests" DROP CONSTRAINT "license_requests_leadId_fkey";

-- AlterTable: add new columns nullable first, and drop the leadId NOT NULL constraint.
ALTER TABLE "license_requests"
  ADD COLUMN     "businessName" TEXT,
  ADD COLUMN     "customerName" TEXT,
  ADD COLUMN     "email" TEXT,
  ADD COLUMN     "whatsapp" TEXT,
  ALTER COLUMN  "leadId" DROP NOT NULL;

-- Backfill existing rows from their linked Lead.
UPDATE "license_requests" AS lr
SET "customerName" = leads.name,
    "email" = COALESCE(leads.email, ''),
    "whatsapp" = leads.phone,
    "businessName" = leads.company
FROM "leads"
WHERE lr."leadId" = leads.id;

-- Any row that somehow has no linked Lead (shouldn't exist yet, but guard anyway) falls back
-- to a placeholder rather than leaving NOT NULL unsatisfiable.
UPDATE "license_requests" SET "customerName" = 'Unknown' WHERE "customerName" IS NULL;
UPDATE "license_requests" SET "email" = '' WHERE "email" IS NULL;

-- Now that every row has a value, enforce NOT NULL going forward.
ALTER TABLE "license_requests"
  ALTER COLUMN "customerName" SET NOT NULL,
  ALTER COLUMN "email" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "license_requests" ADD CONSTRAINT "license_requests_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
