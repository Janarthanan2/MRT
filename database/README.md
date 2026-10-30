# MRT database setup and migration safety

## Important: bootstrap vs. production migrations

`schema-v2.sql` is a **non-destructive bootstrap script** for a new/empty MySQL database.

- It does not contain `DROP TABLE` statements.
- It uses `CREATE TABLE IF NOT EXISTS` so rerunning it will not delete existing data.
- `IF NOT EXISTS` does **not** reconcile the structure of a table that already exists. It will not add missing columns, change indexes, or repair foreign keys.
- Do not use this file to upgrade an existing production database.

## Production migration policy

Use Flyway versioned migrations in the actual Spring Boot application:

`backend/src/main/resources/db/migration/V1__description.sql`

Rules:

1. Never edit a migration after it has been applied to a shared database.
2. Add a new migration for every schema change.
3. Do not use `DROP TABLE`, destructive column changes, or table recreation in routine migrations.
4. Back up the database before any migration that changes or removes data.
5. Keep Hibernate schema generation disabled; validate mappings rather than generating production DDL.
6. Use a dedicated migration database account for Flyway and a least-privilege runtime account for the application.
7. Verify each deployment using `flyway_schema_history` and database integration tests.

## Backend integration status

The repository branch currently contains the static frontend, SQL schema, and `ml_service/`, but no committed `backend/` Spring Boot project. The production API integration must be implemented against the real backend source so existing authentication, package names, controllers, and security rules are preserved. Do not point the frontend at a guessed endpoint until that API exists.

The intended production request path is:

```
Browser -> Spring Boot API -> MySQL
                        \-> internal ML FastAPI service
```

The browser should not call the internal ML service directly in production. Spring Boot should authenticate and authorize the request, call the ML service, persist the model/version/prediction/candidates, and return a normalized response.
