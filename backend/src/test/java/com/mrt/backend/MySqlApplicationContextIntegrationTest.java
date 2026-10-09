package com.mrt.backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@EnabledIfEnvironmentVariable(named = "MYSQL_IT_URL", matches = ".+")
class MySqlApplicationContextIntegrationTest {
    @DynamicPropertySource
    static void mysqlProperties(DynamicPropertyRegistry properties) {
        properties.add("spring.datasource.url", () -> System.getenv("MYSQL_IT_URL"));
        properties.add("spring.datasource.username", () -> System.getenv("MYSQL_IT_USERNAME"));
        properties.add("spring.datasource.password", () -> System.getenv("MYSQL_IT_PASSWORD"));
        properties.add("spring.datasource.driver-class-name", () -> "com.mysql.cj.jdbc.Driver");
        properties.add("spring.flyway.enabled", () -> "true");
        properties.add("spring.flyway.locations", () -> "classpath:db/migration");
        properties.add("spring.sql.init.mode", () -> "never");
        properties.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        properties.add("mrt.jwt.secret", () -> "ci-test-secret-key-at-least-32-bytes-long");
        properties.add("mrt.cors-origins", () -> "http://localhost:5173");
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void applicationStartsAndFlywayHistoryIsCleanOnMySql() {
        Integer failed = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE success = 0", Integer.class);
        assertTrue(failed != null && failed == 0, "Flyway must have no failed migration records");
        Integer users = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'",
                Integer.class);
        assertTrue(users != null && users == 1, "The migrated users table must exist");
    }
}
