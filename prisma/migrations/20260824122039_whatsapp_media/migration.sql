-- CreateEnum
CREATE TYPE "WhatsAppMediaDownloadStatus" AS ENUM ('PENDING', 'DOWNLOADING', 'COMPLETE', 'FAILED', 'REJECTED_SIZE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WhatsAppMessageType" ADD VALUE 'STICKER';
ALTER TYPE "WhatsAppMessageType" ADD VALUE 'CONTACTS';
ALTER TYPE "WhatsAppMessageType" ADD VALUE 'REACTION';

-- CreateTable
CREATE TABLE "whatsapp_media" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "sha256" TEXT,
    "mimeType" TEXT NOT NULL,
    "detectedMimeType" TEXT,
    "fileSize" INTEGER,
    "storageKey" TEXT,
    "originalFilename" TEXT,
    "caption" TEXT,
    "isVoiceNote" BOOLEAN NOT NULL DEFAULT false,
    "downloadStatus" "WhatsAppMediaDownloadStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "whatsapp_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_media_messageId_key" ON "whatsapp_media"("messageId");

-- CreateIndex
CREATE INDEX "whatsapp_media_mediaId_idx" ON "whatsapp_media"("mediaId");

-- CreateIndex
CREATE INDEX "whatsapp_media_sha256_idx" ON "whatsapp_media"("sha256");

-- CreateIndex
CREATE INDEX "whatsapp_media_downloadStatus_idx" ON "whatsapp_media"("downloadStatus");

-- AddForeignKey
ALTER TABLE "whatsapp_media" ADD CONSTRAINT "whatsapp_media_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "whatsapp_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
