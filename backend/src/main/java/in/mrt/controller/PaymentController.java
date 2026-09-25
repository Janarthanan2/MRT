package in.mrt.controller;

import in.mrt.security.JwtService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
  private final JdbcTemplate db;
  private final JwtService jwt;
  public PaymentController(JdbcTemplate db,JwtService jwt){this.db=db;this.jwt=jwt;}

  private long uid(String h){
    if(h==null||!h.startsWith("Bearer ")) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);
    return Long.parseLong(jwt.parse(h.substring(7)).getSubject());
  }

  @PostMapping("/create")
  public Map<String,Object> create(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object> b){
    uid(h);
    return Map.of("success",true,"paymentId","MRT-PAY-"+UUID.randomUUID(),"amount",b.getOrDefault("amount",0),"status","CREATED");
  }

  @PostMapping("/verify")
  public Map<String,Object> verify(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object> b){
    uid(h);
    return Map.of("success",true,"verified",true,"status","PAID","paymentId",b.get("paymentId"));
  }

  @GetMapping("/{orderId}")
  public Map<String,Object> status(@RequestHeader("Authorization") String h,@PathVariable long orderId){
    long u=uid(h);
    return db.queryForMap("select id,order_number,payment_status,total from orders where id=? and user_id=?",orderId,u);
  }
}
