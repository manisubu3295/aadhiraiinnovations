-- CreateEnum
CREATE TYPE "WhatsAppStatus" AS ENUM ('SENT', 'FAILED');

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "whatsappAccessToken" TEXT,
ADD COLUMN     "whatsappApiVersion" TEXT,
ADD COLUMN     "whatsappBusinessAccountId" TEXT,
ADD COLUMN     "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsappPhoneNumberId" TEXT,
ADD COLUMN     "whatsappStaffNotifyNumber" TEXT;

-- CreateTable
CREATE TABLE "whatsapp_templates" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "templateName" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en_US',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_logs" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "templateKey" TEXT,
    "status" "WhatsAppStatus" NOT NULL,
    "errorMessage" TEXT,
    "relatedType" TEXT,
    "relatedId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_templates_key_key" ON "whatsapp_templates"("key");
