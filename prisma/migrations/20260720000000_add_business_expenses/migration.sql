-- CreateEnum
CREATE TYPE "BusinessExpenseCategory" AS ENUM ('GST', 'SERVER', 'DOMAIN', 'SALARY', 'SOFTWARE', 'OTHER');

-- CreateTable
CREATE TABLE "business_expenses" (
    "id" TEXT NOT NULL,
    "category" "BusinessExpenseCategory" NOT NULL DEFAULT 'OTHER',
    "amount" DECIMAL(12,2) NOT NULL,
    "paidOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidTo" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "business_expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "business_expenses" ADD CONSTRAINT "business_expenses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
