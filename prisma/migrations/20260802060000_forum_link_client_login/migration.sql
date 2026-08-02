-- AlterTable
ALTER TABLE "forum_users" ADD COLUMN     "linkedUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "forum_users_linkedUserId_key" ON "forum_users"("linkedUserId");

-- AddForeignKey
ALTER TABLE "forum_users" ADD CONSTRAINT "forum_users_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
