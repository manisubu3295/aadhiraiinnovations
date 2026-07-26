-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "license_requests" ADD COLUMN     "amountPaid" INTEGER,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT;

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "razorpayKeyId" TEXT,
ADD COLUMN     "razorpayKeySecret" TEXT,
ADD COLUMN     "razorpayWebhookSecret" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "license_requests_razorpayOrderId_key" ON "license_requests"("razorpayOrderId");
