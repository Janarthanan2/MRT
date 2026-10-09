package in.mrt.domain.services;

import in.mrt.domain.repositories.UserRepository;
import in.mrt.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String adminEmail;
    private final String adminPassword;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       @Value("${mrt.admin-email}") String adminEmail,
                       @Value("${mrt.admin-password}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }
}
												
