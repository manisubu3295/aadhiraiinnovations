-- CreateTable
CREATE TABLE "user_whatsapp_settings" (
    "id" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "accessTokenEncrypted" TEXT NOT NULL,
    "accessTokenLast4" TEXT,
    "webhookVerifyToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_whatsapp_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_whatsapp_settings_userId_key" ON "user_whatsapp_settings"("userId");

-- AddForeignKey
ALTER TABLE "user_whatsapp_settings" ADD CONSTRAINT "user_whatsapp_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
