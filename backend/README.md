# MRT Metal Mart Backend

Spring Boot REST API for both the customer storefront and admin portal.

## Run
1. Install Java 21 and Maven.
2. Create MySQL or let the configured user create `mrt_db`.
3. Set `DB_USERNAME`, `DB_PASSWORD`, and a strong `JWT_SECRET` if needed.
4. From `backend`: `mvn spring-boot:run`.

Base URL: http://localhost:8080/api

The frontend can use `VITE_API_BASE_URL=http://localhost:8080/api`.

The API is intentionally separated from the GitHub Pages frontend; GitHub Pages hosts static files only.