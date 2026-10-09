package in.mrt.domain.services;

import in.mrt.domain.entities.User;
import in.mrt.domain.enums.UserRole;
import in.mrt.domain.repositories.UserRepository;
import in.mrt.security.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock Claims claims;

    @InjectMocks AuthService authService;

    @Test
    void registerCreatesCustomerAndReturnsToken() {
        when(userRepository.existsByEmail("test@mrt.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });
        when(jwtService.generate(1L, "test@mrt.com", "CUSTOMER")).thenReturn("mock_token");

        Map<String, Object> response = authService.register(Map.of(
                "name", "Test User",
                "email", " Test@MRT.com ",
                "password", "password123",
                "phone", "1234567890"));

        assertEquals("mock_token", response.get("token"));
        @SuppressWarnings("unchecked")
        Map<String, Object> user = (Map<String, Object>) response.get("user");
        assertEquals("Test User", user.get("name"));
        assertEquals("CUSTOMER", user.get("role"));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByEmail("test@mrt.com")).thenReturn(true);
        assertThrows(ResponseStatusException.class, () -> authService.register(Map.of(
                "email", "test@mrt.com", "password", "password123")));
        verify(userRepository, never()).save(any());
    }

    @Test
    void loginReturnsTokenForValidCredentials() {
        User existing = User.builder().id(1L).firstName("Test").email("test@mrt.com")
                .passwordHash("hashed").role(UserRole.CUSTOMER).accountLocked(false).build();
        when(userRepository.findByEmail("test@mrt.com")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(true);
        when(userRepository.save(existing)).thenReturn(existing);
        when(jwtService.generate(1L, "test@mrt.com", "CUSTOMER")).thenReturn("mock_token");

        Map<String, Object> response = authService.login(Map.of(
                "email", "test@mrt.com", "password", "password123"));
        assertEquals("mock_token", response.get("token"));
    }

    @Test
    void loginRejectsInvalidPassword() {
        User existing = User.builder().id(1L).email("test@mrt.com")
                .passwordHash("hashed").role(UserRole.CUSTOMER).build();
        when(userRepository.findByEmail("test@mrt.com")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> authService.login(Map.of(
                "email", "test@mrt.com", "password", "wrong")));
    }

    @Test
    void loginRejectsLockedAccount() {
        User existing = User.builder().id(1L).email("test@mrt.com")
                .passwordHash("hashed").role(UserRole.CUSTOMER).accountLocked(true).build();
        when(userRepository.findByEmail("test@mrt.com")).thenReturn(Optional.of(existing));

        assertThrows(ResponseStatusException.class, () -> authService.login(Map.of(
                "email", "test@mrt.com", "password", "password123")));
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void getCurrentUserReadsSubjectFromVerifiedToken() {
        User existing = User.builder().id(1L).firstName("Test").email("test@mrt.com")
                .role(UserRole.CUSTOMER).build();
        when(jwtService.parse("mock_token")).thenReturn(claims);
        when(claims.getSubject()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));

        Map<String, Object> response = authService.getCurrentUser("Bearer mock_token");
        assertEquals("Test", response.get("name"));
    }

    @Test
    void logoutReturnsSuccess() {
        assertEquals(true, authService.logout().get("success"));
    }

    @Test
    void forgotPasswordDoesNotRevealAccountExistence() {
        assertEquals(true, authService.forgotPassword(Map.of("email", "test@mrt.com")).get("success"));
        verifyNoInteractions(userRepository);
    }

    @Test
    void resetPasswordCannotChangePasswordWithoutTokenSupport() {
        assertThrows(ResponseStatusException.class,
                () -> authService.resetPassword(Map.of("email", "test@mrt.com", "password", "newpassword123")));
        verifyNoInteractions(userRepository);
    }
}
