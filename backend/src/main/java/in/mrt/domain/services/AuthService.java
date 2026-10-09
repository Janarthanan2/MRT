package in.mrt.domain.services;

import in.mrt.domain.entities.User;
import in.mrt.domain.enums.UserRole;
import in.mrt.domain.repositories.UserRepository;
import in.mrt.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public Map<String, Object> register(Map<String, Object> data) {
        String email = normalizeEmail(value(data, "email"));
        String password = value(data, "password");
        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid email is required");
        }
        if (password == null || password.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must contain at least 8 characters");
        }
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        String name = value(data, "name");
        String firstName = value(data, "firstName");
        String lastName = value(data, "lastName");
        if (firstName == null || firstName.isBlank()) {
            if (name != null && !name.isBlank()) {
                String trimmed = name.trim();
                int split = trimmed.indexOf(' ');
                firstName = split < 0 ? trimmed : trimmed.substring(0, split);
                if (lastName == null && split >= 0) lastName = trimmed.substring(split + 1).trim();
            } else {
                firstName = email.substring(0, email.indexOf('@'));
            }
        }
        if (firstName.length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "First name must be 100 characters or fewer");
        }
        if (lastName != null && lastName.length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Last name must be 100 characters or fewer");
        }

        User user = User.builder()
                .firstName(firstName.trim())
                .lastName(lastName == null || lastName.isBlank() ? null : lastName.trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .phone(value(data, "phone"))
                .role(UserRole.CUSTOMER)
                .emailVerified(false)
                .accountLocked(false)
                .lastLoginAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);
        return authenticationResponse(saved);
    }

    @Transactional
    public Map<String, Object> login(Map<String, Object> data) {
        String email = normalizeEmail(value(data, "email"));
        String password = value(data, "password");
        if (email == null || password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (user.isAccountLocked()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This account is locked");
        }
        if (user.getPasswordHash() == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        return authenticationResponse(saved);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCurrentUser(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "A Bearer token is required");
        }
        String token = authorizationHeader.substring(7).trim();
        if (token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "A Bearer token is required");
        }

        try {
            Claims claims = jwtService.parse(token);
            String subject = claims.getSubject();
            long userId = Long.parseLong(subject);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
            if (user.isAccountLocked()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This account is locked");
            }
            return userResponse(user);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (JwtException | IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
    }

    public Map<String, Object> logout() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("message", "Logged out locally. Discard the bearer token on the client.");
        return result;
    }

    public Map<String, Object> forgotPassword(Map<String, Object> data) {
        // Deliberately do not disclose whether an account exists. Delivery of reset
        // emails is not implemented until a token store and mail provider are configured.
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("message", "If an account exists for that email, password reset instructions will be provided.");
        return result;
    }

    public Map<String, Object> resetPassword(Map<String, Object> data) {
        // Never change a password based only on an email address.
        throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED,
                "Password reset is unavailable until secure, expiring reset tokens are configured");
    }

    private Map<String, Object> authenticationResponse(User user) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", jwtService.generate(user.getId(), user.getEmail(), user.getRole().name()));
        result.put("user", userResponse(user));
        return result;
    }

    private Map<String, Object> userResponse(User user) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        String first = user.getFirstName() == null ? "" : user.getFirstName().trim();
        String last = user.getLastName() == null ? "" : user.getLastName().trim();
        result.put("name", (first + " " + last).trim());
        result.put("email", user.getEmail());
        result.put("phone", user.getPhone());
        result.put("role", user.getRole() == null ? UserRole.CUSTOMER.name() : user.getRole().name());
        result.put("status", user.isAccountLocked() ? "LOCKED" : "ACTIVE");
        return result;
    }

    private static String value(Map<String, Object> data, String key) {
        if (data == null || data.get(key) == null) return null;
        String value = String.valueOf(data.get(key)).trim();
        return value.isEmpty() ? null : value;
    }

    private static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }
}
