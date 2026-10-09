package in.mrt.domain.services;

import in.mrt.domain.entities.User;
import in.mrt.domain.repositories.UserRepository;
import in.mrt.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_Success() {
        Map<String, Object> data = Map.of(
                "email", "test@mrt.com",
                "password", "password123",
                "phone", "1234567890"
        );

        when(userRepository.existsByEmail("test@mrt.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArguments()[0];
            return userRepository.save(u);
        });
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(User.builder().id(1L).firstName("Test").email("test@mrt.com").phone("1234567890").role(in.mrt.domain.enums.UserRole.CUSTOMER).build()));
        when(jwtService.generate(anyLong(), anyString(), anyString())).thenReturn("mock_token");

        Map<String, Object> result = authService.register(data);

        assertNotNull(result);
        assertTrue(result.containsKey("token"));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void login_Success() {
        Map<String, Object> data = Map.of(
                "email", "test@mrt.com",
                "password", "password123"
        );

        when(userRepository.findByEmail("test@mrt.com")).thenReturn(Optional.of(User.builder()
                .id(1L).email("test@mrt.com").passwordHash("hashed_password").role(in.mrt.domain.enums.UserRole.CUSTOMER).build()));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(jwtService.generate(anyLong(), anyString(), anyString())).thenReturn("mock_token");

        Map<String, Object> result = authService.login(data);

        assertNotNull(result);
        assertEquals("mock_token", result.get("token"));
    }

    @Test
    void login_Admin_Success() {
        Map<String, Object> data = Map.of(
                "email", "admin@mrt.com",
                "password", "admin_pass"
        );

        when(userRepository.findByEmail("admin@mrt.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArguments()[0];
            return userRepository.save(u);
        });
        when(jwtService.generate(anyLong(), anyString(), anyString())).thenReturn("admin_token");

        Map<String, Object> result = authService.login(data);

        assertNotNull(result);
        assertEquals("admin_token", result.get("token"));
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        Map<String, Object> data = Map.of(
                "email", "wrong@mrt.com",
                "password", "wrong_pass"
        );

        when(userRepository.findByEmail("wrong@mrt.com")).thenReturn(Optional.of(User.builder()
                .id(1L).email("wrong@mrt.com").passwordHash("hashed_password").role(in.mrt.domain.enums.UserRole.CUSTOMER).build()));
        when(passwordEncoder.matches("wrong_pass", "hashed_password")).thenReturn(false);

        assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> authService.login(data));
    }

    @Test
    void getCurrentUser_Success() {
        String authHeader = "Bearer mock_token";
        when(jwtService.parse("mock_token")).thenReturn(Map.of("subject", "1"));
        when(userRepository.findById(1L)).thenReturn(Optional.of(User.builder()
                .id(1L).firstName("Test").email("test@mrt.com").phone("1234567890").role(in.mrt.domain.enums.UserRole.CUSTOMER).build()));

        Map<String, Object> result = authService.getCurrentUser(authHeader);

        assertNotNull(result);
        assertEquals("Test", result.get("name"));
    }

    @Test
    void logout_Success() {
        Map<String, Object> result = authService.logout();
        assertEquals(true, result.get("success"));
    }

    @Test
    void forgotPassword_Success() {
        Map<String, Object> data = Map.of("email", "test@mrt.com");
        Map<String, Object> result = authService.forgotPassword(data);
        assertEquals(true, result.get("success"));
    }

    @Test
    void resetPassword_Success() {
        Map<String, Object> data = Map.of("email", "test@mrt.com");
        Map<String, Object> result = authService.resetPassword(data);
        assertEquals(true, result.get("success"));
    }
}
