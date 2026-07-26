/*
  Warnings:

  - You are about to drop the column `licenseApiKey` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `licenseApiUrl` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "settings" DROP COLUMN "licenseApiKey",
DROP COLUMN "licenseApiUrl";
