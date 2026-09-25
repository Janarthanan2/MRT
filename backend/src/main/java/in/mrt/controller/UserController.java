package in.mrt.controller;
import in.mrt.security.JwtService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api")
public class UserController {
 private final JdbcTemplate db; private final JwtService jwt;
 public UserController(JdbcTemplate db,JwtService jwt){this.db=db;this.jwt=jwt;}
 private long uid(String h){if(h==null||!h.startsWith("Bearer ")) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED); return Long.parseLong(jwt.parse(h.substring(7)).getSubject());}
 @GetMapping("/user/profile") public Map<String,Object> profile(@RequestHeader("Authorization") String h){return db.queryForMap("select id,name,email,phone,role,status,created_at from users where id=?",uid(h));}
 @PutMapping("/user/profile") public Map<String,Object> profile(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object>b){long id=uid(h);db.update("update users set name=?,phone=? where id=?",b.get("name"),b.get("phone"),id);return profile(h);}
 @GetMapping("/cart") public List<Map<String,Object>> cart(@RequestHeader("Authorization") String h){return db.queryForList("select c.id,c.product_id,c.quantity,p.name,p.price,p.image_url from cart_items c join products p on p.id=c.product_id where c.user_id=?",uid(h));}
 @PostMapping("/cart/items") public Map<String,Object> addCart(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object>b){long u=uid(h),p=((Number)b.get("productId")).longValue();int q=((Number)b.getOrDefault("quantity",1)).intValue();db.update("insert into cart_items(user_id,product_id,quantity) values(?,?,?) on duplicate key update quantity=quantity+values(quantity)",u,p,q);return Map.of("success",true);}
 @PutMapping("/cart/items/{id}") public Map<String,Object> updateCart(@RequestHeader("Authorization") String h,@PathVariable Long id,@RequestBody Map<String,Object>b){db.update("update cart_items set quantity=? where id=? and user_id=?",b.get("quantity"),id,uid(h));return Map.of("success",true);}
 @DeleteMapping("/cart/items/{id}") public Map<String,Object> deleteCart(@RequestHeader("Authorization") String h,@PathVariable Long id){db.update("delete from cart_items where id=? and user_id=?",id,uid(h));return Map.of("success",true);}
 @DeleteMapping("/cart") public Map<String,Object> clearCart(@RequestHeader("Authorization") String h){db.update("delete from cart_items where user_id=?",uid(h));return Map.of("success",true);}
 @GetMapping("/wishlist") public List<Map<String,Object>> wishlist(@RequestHeader("Authorization") String h){return db.queryForList("select w.id,w.product_id,p.name,p.price,p.image_url from wishlist_items w join products p on p.id=w.product_id where w.user_id=?",uid(h));}
 @PostMapping("/wishlist/items/{productId}") public Map<String,Object> addWish(@RequestHeader("Authorization") String h,@PathVariable Long productId){db.update("insert ignore into wishlist_items(user_id,product_id) values(?,?)",uid(h),productId);return Map.of("success",true);}
 @DeleteMapping("/wishlist/items/{productId}") public Map<String,Object> delWish(@RequestHeader("Authorization") String h,@PathVariable Long productId){db.update("delete from wishlist_items where user_id=? and product_id=?",uid(h),productId);return Map.of("success",true);}
 @GetMapping("/orders") public List<Map<String,Object>> orders(@RequestHeader("Authorization") String h){return db.queryForList("select * from orders where user_id=? order by created_at desc",uid(h));}
 @GetMapping("/orders/{id}") public Map<String,Object> order(@RequestHeader("Authorization") String h,@PathVariable Long id){return db.queryForMap("select * from orders where id=? and user_id=?",id,uid(h));}
 @PostMapping("/orders") public Map<String,Object> createOrder(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object>b){
  long u=uid(h); Double total=((Number)b.getOrDefault("total",0)).doubleValue(); db.update("insert into orders(user_id,total,shipping_address) values(?,?,?)",u,total,b.get("shippingAddress"));
  Long id=db.queryForObject("select max(id) from orders where user_id=?",Long.class,u); db.update("delete from cart_items where user_id=?",u); return db.queryForMap("select * from orders where id=?",id);
 }
 @PostMapping("/orders/{id}/cancel") public Map<String,Object> cancel(@RequestHeader("Authorization") String h,@PathVariable Long id){db.update("update orders set status='CANCELLED' where id=? and user_id=? and status in ('PENDING','PROCESSING')",id,uid(h));return order(h,id);}
 @GetMapping("/orders/{id}/tracking") public Map<String,Object> tracking(@RequestHeader("Authorization") String h,@PathVariable Long id){return db.queryForMap("select id,status,tracking_number from orders where id=? and user_id=?",id,uid(h));}
 @GetMapping("/notifications") public List<Map<String,Object>> notifications(@RequestHeader("Authorization") String h){return db.queryForList("select * from notifications where user_id=? or user_id is null order by created_at desc",uid(h));}
 @PatchMapping("/notifications/{id}/read") public Map<String,Object> read(@RequestHeader("Authorization") String h,@PathVariable Long id){db.update("update notifications set is_read=true where id=? and (user_id=? or user_id is null)",id,uid(h));return Map.of("success",true);}
 @PatchMapping("/notifications/read-all") public Map<String,Object> readAll(@RequestHeader("Authorization") String h){db.update("update notifications set is_read=true where user_id=?",uid(h));return Map.of("success",true);}
 @GetMapping("/reviews/product/{productId}") public List<Map<String,Object>> reviews(@PathVariable Long productId){return db.queryForList("select r.*,u.name user_name from reviews r join users u on u.id=r.user_id where r.product_id=? and r.status='PUBLISHED' order by r.created_at desc",productId);}
 @PostMapping("/reviews") public Map<String,Object> review(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object>b){long u=uid(h);db.update("insert into reviews(user_id,product_id,rating,comment) values(?,?,?,?)",u,b.get("productId"),b.get("rating"),b.get("comment"));return Map.of("success",true);}
 @PostMapping("/custom-orders") public Map<String,Object> custom(@RequestHeader(value="Authorization",required=false) String h,@RequestBody Map<String,Object>b){Long u=null;if(h!=null&&h.startsWith("Bearer "))u=uid(h);db.update("insert into custom_orders(user_id,name,email,phone,description,quantity) values(?,?,?,?,?,?)",u,b.get("name"),b.get("email"),b.get("phone"),b.get("description"),b.getOrDefault("quantity",1));return Map.of("success",true);}
 @GetMapping("/custom-orders") public List<Map<String,Object>> customList(@RequestHeader("Authorization") String h){return db.queryForList("select * from custom_orders where user_id=? order by created_at desc",uid(h));}
 @GetMapping("/quotations") public List<Map<String,Object>> quotations(@RequestHeader("Authorization") String h){return db.queryForList("select * from quotations where user_id=? order by created_at desc",uid(h));}
 @PostMapping("/quotations/{id}/accept") public Map<String,Object> acceptQuote(@RequestHeader("Authorization") String h,@PathVariable Long id){db.update("update quotations set status='ACCEPTED' where id=? and user_id=?",id,uid(h));return Map.of("success",true);}
}