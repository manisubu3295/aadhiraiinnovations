-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "adminMenuKeys" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "staffMenuKeys" TEXT[] DEFAULT ARRAY[]::TEXT[];
