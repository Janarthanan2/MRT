package in.mrt.controller;

import in.mrt.domain.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public Map<String,Object> register(@RequestBody Map<String,Object> b) {
    return authService.register(b);
  }

  @PostMapping("/login")
  public Map<String,Object> login(@RequestBody Map<String,Object> b) {
    return authService.login(b);
  }

  @GetMapping("/me")
  public Map<String,Object> me(@RequestHeader(value="Authorization",required=false) String h) {
    return authService.getCurrentUser(h);
  }

  @PostMapping("/logout")
  public Map<String,Object> logout(){
    return authService.logout();
  }

  @PostMapping("/forgot-password")
  public Map<String,Object> forgot(@RequestBody Map<String,Object> b){
    return authService.forgotPassword(b);
  }

  @PostMapping("/reset-password")
  public Map<String,Object> reset(@RequestBody Map<String,Object> b){
    return authService.resetPassword(b);
  }
}
