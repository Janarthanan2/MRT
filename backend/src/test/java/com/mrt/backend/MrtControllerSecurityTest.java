package com.mrt.backend;

import in.mrt.security.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class MrtControllerSecurityTest {
    private JdbcTemplate db;
    private JwtService jwtService;
    private Claims claims;
    private MrtController controller;

    @BeforeEach
    void setUp() {
        db = mock(JdbcTemplate.class);
        jwtService = mock(JwtService.class);
        claims = mock(Claims.class);
        controller = new MrtController(db, mock(PasswordEncoder.class), jwtService);
    }

    @Test
    void rejectsMissingBearerToken() {
        assertEquals(401, controller.adminAuthorizationStatus(null));
        assertEquals(401, controller.adminAuthorizationStatus("Basic token"));
        verifyNoInteractions(db, jwtService);
    }

    @Test
    void rejectsInvalidOrExpiredJwt() {
        when(jwtService.parse("bad-token")).thenThrow(new io.jsonwebtoken.JwtException("invalid"));
        assertEquals(401, controller.adminAuthorizationStatus("Bearer bad-token"));
        verifyNoInteractions(db);
    }

    @Test
    void rejectsUnknownUser() {
        prepareToken(42L);
        when(db.queryForList("select role,account_locked from users where id=?", 42L)).thenReturn(List.of());
        assertEquals(401, controller.adminAuthorizationStatus("Bearer good-token"));
    }

    @Test
    void rejectsLockedAccount() {
        prepareToken(42L);
        when(db.queryForList("select role,account_locked from users where id=?", 42L))
                .thenReturn(List.of(Map.of("role", "ADMIN", "account_locked", true)));
        assertEquals(401, controller.adminAuthorizationStatus("Bearer good-token"));
    }

    @Test
    void forbidsCustomerRole() {
        prepareToken(42L);
        when(db.queryForList("select role,account_locked from users where id=?", 42L))
                .thenReturn(List.of(Map.of("role", "CUSTOMER", "account_locked", false)));
        assertEquals(403, controller.adminAuthorizationStatus("Bearer good-token"));
    }

    @Test
    void permitsAdminRole() {
        prepareToken(42L);
        when(db.queryForList("select role,account_locked from users where id=?", 42L))
                .thenReturn(List.of(Map.of("role", "ADMIN", "account_locked", false)));
        assertEquals(200, controller.adminAuthorizationStatus("Bearer good-token"));
    }

    @Test
    void permitsSuperAdminRole() {
        prepareToken(42L);
        when(db.queryForList("select role,account_locked from users where id=?", 42L))
                .thenReturn(List.of(Map.of("role", "SUPER_ADMIN", "account_locked", false)));
        assertEquals(200, controller.adminAuthorizationStatus("Bearer good-token"));
    }

    @Test
    void supportsLegacyStatusColumnAndRejectsSuspendedAccount() {
        prepareToken(42L);
        when(db.queryForList("select role,account_locked from users where id=?", 42L))
                .thenThrow(new BadSqlGrammarException("query", "sql", new SQLException("Unknown column account_locked")));
        when(db.queryForList("select role,status from users where id=?", 42L))
                .thenReturn(List.of(Map.of("role", "ADMIN", "status", "SUSPENDED")));
        assertEquals(401, controller.adminAuthorizationStatus("Bearer good-token"));
    }

    @Test
    void supportsLegacyStatusColumnForActiveAdmin() {
        prepareToken(42L);
        when(db.queryForList("select role,account_locked from users where id=?", 42L))
                .thenThrow(new BadSqlGrammarException("query", "sql", new SQLException("Unknown column account_locked")));
        when(db.queryForList("select role,status from users where id=?", 42L))
                .thenReturn(List.of(Map.of("role", "ADMIN", "status", "ACTIVE")));
        assertEquals(200, controller.adminAuthorizationStatus("Bearer good-token"));
    }

    private void prepareToken(long id) {
        when(jwtService.parse("good-token")).thenReturn(claims);
        when(claims.getSubject()).thenReturn(String.valueOf(id));
    }
}
