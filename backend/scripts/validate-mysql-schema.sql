-- Read-only diagnostics for an existing MRT MySQL database.
-- Run with: mysql --host=HOST --user=USER -p DATABASE < backend/scripts/validate-mysql-schema.sql
-- This script does not modify application tables or migration history.

SELECT DATABASE() AS database_name, VERSION() AS mysql_version, NOW() AS checked_at;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name IN ('users', 'flyway_schema_history')
ORDER BY table_name;

-- Expected users columns for the current application + compatibility migration.
SELECT expected.column_name,
       CASE WHEN actual.column_name IS NULL THEN 'MISSING' ELSE 'PRESENT' END AS column_status,
       actual.column_type,
       actual.is_nullable,
       actual.column_default
FROM (
    SELECT 'id' AS column_name UNION ALL
    SELECT 'public_id' UNION ALL SELECT 'name' UNION ALL
    SELECT 'first_name' UNION ALL SELECT 'last_name' UNION ALL
    SELECT 'email' UNION ALL SELECT 'password_hash' UNION ALL
    SELECT 'phone' UNION ALL SELECT 'role' UNION ALL
    SELECT 'status' UNION ALL SELECT 'email_verified' UNION ALL
    SELECT 'email_verified_at' UNION ALL SELECT 'account_locked' UNION ALL
    SELECT 'last_login_at' UNION ALL SELECT 'created_at' UNION ALL
    SELECT 'updated_at'
) expected
LEFT JOIN information_schema.columns actual
  ON actual.table_schema = DATABASE()
 AND actual.table_name = 'users'
 AND actual.column_name = expected.column_name
ORDER BY expected.column_name;

-- Show Flyway history when the table exists; otherwise emit a readable diagnostic.
SET @flyway_history_sql = IF(
    EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = 'flyway_schema_history'
    ),
    'SELECT installed_rank, version, description, type, script, success FROM flyway_schema_history ORDER BY installed_rank',
    'SELECT ''flyway_schema_history is MISSING; do not run migrations against this database until its provenance is established'' AS diagnostic'
);
PREPARE flyway_history_stmt FROM @flyway_history_sql;
EXECUTE flyway_history_stmt;
DEALLOCATE PREPARE flyway_history_stmt;

-- Count failed migrations if Flyway history exists.
SET @flyway_failed_sql = IF(
    EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = 'flyway_schema_history'
    ),
    'SELECT COUNT(*) AS failed_migration_count FROM flyway_schema_history WHERE success = 0',
    'SELECT NULL AS failed_migration_count'
);
PREPARE flyway_failed_stmt FROM @flyway_failed_sql;
EXECUTE flyway_failed_stmt;
DEALLOCATE PREPARE flyway_failed_stmt;
