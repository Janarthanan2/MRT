package in.mrt.controller;
import in.mrt.security.JwtService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final JdbcTemplate db; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthController(JdbcTemplate db,PasswordEncoder encoder,JwtService jwt){this.db=db;this.encoder=encoder;this.jwt=jwt;}
 @PostMapping("/register") public Map<String,Object> register(@RequestBody Map<String,Object> b){
  String email=String.valueOf(b.get("email")).trim().toLowerCase();
  if(!db.queryForList("select id from users where email=?",email).isEmpty()) throw new RuntimeException("Email already registered");
  db.update("insert into users(name,email,password_hash,phone) values(?,?,?,?)",b.get("name"),email,encoder.encode(String.valueOf(b.get("password"))),b.get("phone"));
  Long id=db.queryForObject("select id from users where email=?",Long.class,email);
  return loginResponse(id,email,"USER");
 }
 @PostMapping("/login") public Map<String,Object> login(@RequestBody Map<String,Object> b){
  String email=String.valueOf(b.get("email")).trim().toLowerCase();
  var rows=db.queryForList("select id,password_hash,role,status,name from users where email=?",email);
  if(rows.isEmpty()||!"ACTIVE".equals(rows.get(0).get("status"))||!encoder.matches(String.valueOf(b.get("password")),String.valueOf(rows.get(0).get("password_hash"))))
   throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED,"Invalid credentials");
  var r=rows.get(0); return loginResponse(((Number)r.get("id")).longValue(),email,String.valueOf(r.get("role")));
 }
 private Map<String,Object> loginResponse(Long id,String email,String role){return Map.of("token",jwt.generate(id,email,role),"user",Map.of("id",id,"email",email,"role",role));}
 @GetMapping("/me") public Map<String,Object> me(@RequestHeader(value="Authorization",required=false) String h){
  if(h==null||!h.startsWith("Bearer ")) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);
  var c=jwt.parse(h.substring(7)); return db.queryForMap("select id,name,email,phone,role,status,created_at from users where id=?",Long.valueOf(c.getSubject()));
 }
 @PostMapping("/logout") public Map<String,Object> logout(){return Map.of("success",true);}
 @PostMapping("/forgot-password") public Map<String,Object> forgot(@RequestBody Map<String,Object> b){return Map.of("success",true,"message","If the account exists, password reset instructions will be sent.");}
 @PostMapping("/reset-password") public Map<String,Object> reset(@RequestBody Map<String,Object> b){return Map.of("success",true);}
}