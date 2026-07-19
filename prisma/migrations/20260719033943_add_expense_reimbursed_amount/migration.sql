-- Tracks the actual amount paid out at reimbursement time, which can differ from the claimed amount.
ALTER TABLE "expense_claims" ADD COLUMN "reimbursedAmount" DECIMAL(12,2);
