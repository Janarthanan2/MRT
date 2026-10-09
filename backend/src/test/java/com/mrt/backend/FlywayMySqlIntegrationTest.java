package com.mrt.backend;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class FlywayMySqlIntegrationTest {
    @Test
    void migrationsPreserveExistingUsersAndValidateHistory() throws Exception {
        String url = System.getenv("MYSQL_IT_URL");
        String username = System.getenv("MYSQL_IT_USERNAME");
        String password = System.getenv("MYSQL_IT_PASSWORD");
        assertNotNull(url, "MYSQL_IT_URL must point only to a disposable MySQL database");
        assertNotNull(username, "MYSQL_IT_USERNAME is required");
        assertNotNull(password, "MYSQL_IT_PASSWORD is required");

        Flyway flyway23 = Flyway.configure()
                .dataSource(url, username, password)
                .locations("classpath:db/migration")
                .target("23")
                .validateMigrationNaming(true)
                .load();
        flyway23.migrate();
        assertTrue(flyway23.validateWithResult().validationSuccessful,
                "Migrations V1-V23 must validate before applying compatibility migration");

        long originalId;
        String publicId = "00000000-0000-4000-8000-000000000001";
        try (Connection connection = DriverManager.getConnection(url, username, password);
             PreparedStatement insert = connection.prepareStatement(
                     "INSERT INTO users(public_id,email,first_name,last_name,password_hash,role,status,email_verified_at) " +
                     "VALUES(?,?,?,?,?,?,?,?)", Statement.RETURN_GENERATED_KEYS)) {
            insert.setString(1, publicId);
            insert.setString(2, "mysql-it-existing@example.invalid");
            insert.setString(3, "Existing");
            insert.setString(4, "Customer");
            insert.setString(5, "$2a$10$integration-test-hash-not-for-login");
            insert.setString(6, "CUSTOMER");
            insert.setString(7, "ACTIVE");
            insert.setTimestamp(8, java.sql.Timestamp.valueOf("2026-01-01 00:00:00"));
            assertEquals(1, insert.executeUpdate());
            try (ResultSet keys = insert.getGeneratedKeys()) {
                assertTrue(keys.next());
                originalId = keys.getLong(1);
            }
        }

        Flyway latest = Flyway.configure()
                .dataSource(url, username, password)
                .locations("classpath:db/migration")
                .validateMigrationNaming(true)
                .load();
        latest.migrate();
        assertTrue(latest.validateWithResult().validationSuccessful,
                "All migrations including the compatibility migration must validate");

        try (Connection connection = DriverManager.getConnection(url, username, password);
             PreparedStatement query = connection.prepareStatement(
                     "SELECT id, public_id, name, email_verified, account_locked, status " +
                     "FROM users WHERE email=?")) {
            query.setString(1, "mysql-it-existing@example.invalid");
            try (ResultSet row = query.executeQuery()) {
                assertTrue(row.next(), "The existing user row must still exist");
                assertEquals(originalId, row.getLong("id"), "The user ID must not change");
                assertEquals(publicId, row.getString("public_id"));
                assertEquals("Existing Customer", row.getString("name"));
                assertTrue(row.getBoolean("email_verified"));
                assertFalse(row.getBoolean("account_locked"));
                assertEquals("ACTIVE", row.getString("status"));
                assertFalse(row.next(), "The email must identify exactly one user");
            }
        }

        try (Connection connection = DriverManager.getConnection(url, username, password);
             Statement statement = connection.createStatement();
             ResultSet rows = statement.executeQuery(
                     "SELECT COUNT(*) FROM flyway_schema_history WHERE success = 0")) {
            assertTrue(rows.next());
            assertEquals(0, rows.getInt(1), "Flyway history must not contain failed migrations");
        }
    }
}
