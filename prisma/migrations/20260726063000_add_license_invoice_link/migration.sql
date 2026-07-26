-- AlterTable
ALTER TABLE "license_requests" ADD COLUMN     "invoiceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "license_requests_invoiceId_key" ON "license_requests"("invoiceId");

-- AddForeignKey
ALTER TABLE "license_requests" ADD CONSTRAINT "license_requests_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
