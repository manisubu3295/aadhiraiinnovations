-- Enables trigram similarity search used by GET /api/forum/questions/similar
-- (server/routes/forum.js) to suggest similar existing questions while composing a new one.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateEnum
CREATE TYPE "ForumUserStatus" AS ENUM ('ACTIVE', 'BANNED');

-- AlterEnum
ALTER TYPE "EmailTemplateCategory" ADD VALUE 'FORUM';

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "forumNotifyEmail" TEXT;

-- CreateTable
CREATE TABLE "forum_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" "ForumUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "forum_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_questions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "hiddenAt" TIMESTAMP(3),
    "hiddenReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "acceptedAnswerId" TEXT,

    CONSTRAINT "forum_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_answers" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "hiddenAt" TIMESTAMP(3),
    "hiddenReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" TEXT NOT NULL,
    "authorForumUserId" TEXT,
    "authorStaffUserId" TEXT,

    CONSTRAINT "forum_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_attachments" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" TEXT,
    "answerId" TEXT,
    "uploadedByForumUserId" TEXT,
    "uploadedByStaffUserId" TEXT,

    CONSTRAINT "forum_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forum_users_email_key" ON "forum_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "forum_categories_name_key" ON "forum_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "forum_categories_slug_key" ON "forum_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "forum_questions_slug_key" ON "forum_questions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "forum_questions_acceptedAnswerId_key" ON "forum_questions"("acceptedAnswerId");

-- CreateIndex
CREATE INDEX "forum_questions_createdAt_idx" ON "forum_questions"("createdAt");

-- CreateIndex
CREATE INDEX "forum_questions_categoryId_idx" ON "forum_questions"("categoryId");

-- CreateIndex
CREATE INDEX "forum_questions_title_trgm_idx" ON "forum_questions" USING GIN ("title" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "forum_answers_questionId_createdAt_idx" ON "forum_answers"("questionId", "createdAt");

-- AddForeignKey
ALTER TABLE "forum_questions" ADD CONSTRAINT "forum_questions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "forum_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_questions" ADD CONSTRAINT "forum_questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "forum_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_questions" ADD CONSTRAINT "forum_questions_acceptedAnswerId_fkey" FOREIGN KEY ("acceptedAnswerId") REFERENCES "forum_answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_answers" ADD CONSTRAINT "forum_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "forum_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_answers" ADD CONSTRAINT "forum_answers_authorForumUserId_fkey" FOREIGN KEY ("authorForumUserId") REFERENCES "forum_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_answers" ADD CONSTRAINT "forum_answers_authorStaffUserId_fkey" FOREIGN KEY ("authorStaffUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_attachments" ADD CONSTRAINT "forum_attachments_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "forum_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_attachments" ADD CONSTRAINT "forum_attachments_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "forum_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_attachments" ADD CONSTRAINT "forum_attachments_uploadedByForumUserId_fkey" FOREIGN KEY ("uploadedByForumUserId") REFERENCES "forum_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_attachments" ADD CONSTRAINT "forum_attachments_uploadedByStaffUserId_fkey" FOREIGN KEY ("uploadedByStaffUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
