-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "ccEmails" TEXT[] DEFAULT ARRAY[]::TEXT[];
