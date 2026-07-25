-- One-time data fix: the account with username 'admin' becomes the fixed SUPER_ADMIN account.
-- Split into its own migration (not combined with the ALTER TYPE that added the enum value)
-- because Postgres won't let a new enum value be used until the transaction that added it commits.
UPDATE "users" SET "role" = 'SUPER_ADMIN' WHERE "username" = 'admin' AND "role" = 'ADMIN';
