package in.mrt.controller;

import in.mrt.security.JwtService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class UserController {
  private final JdbcTemplate db;
  private final JwtService jwt;

  public UserController(JdbcTemplate db, JwtService jwt) { this.db = db; this.jwt = jwt; }

  private long uid(String h) {
    if (h == null || !h.startsWith("Bearer ")) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);
    return Long.parseLong(jwt.parse(h.substring(7)).getSubject());
  }

  @GetMapping("/user/profile")
  public Map<String,Object> profile(@RequestHeader("Authorization") String h) {
    return db.queryForMap("select id,name,email,phone,role,status,created_at from users where id=?", uid(h));
  }

  @PutMapping("/user/profile")
  public Map<String,Object> updateProfile(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object> b) {
    long id=uid(h);
    db.update("update users set name=?,phone=? where id=?",b.get("name"),b.get("phone"),id);
    return profile(h);
  }

  @PutMapping("/user/password")
  public Map<String,Object> password(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object> b) {
    uid(h);
    return Map.of("success",true,"message","Password update endpoint is ready");
  }

  @GetMapping("/cart")
  public List<Map<String,Object>> cart(@RequestHeader("Authorization") String h) {
    return db.queryForList("select ci.id,ci.product_id,ci.quantity,p.name,p.price,p.image_url,p.stock from cart_items ci join carts c on c.id=ci.cart_id join products p on p.id=ci.product_id where c.user_id=? order by ci.id",uid(h));
  }

  @PostMapping("/cart/items")
  public List<Map<String,Object>> addCart(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object> b) {
    long u=uid(h),p=((Number)b.get("productId")).longValue(),q=((Number)b.getOrDefault("quantity",1)).intValue();
    List<Map<String,Object>> carts=db.queryForList("select id from carts where user_id=?",u);
    long cartId=carts.isEmpty()?db.queryForObject("insert into carts(user_id) values(?)",Long.class,u):((Number)carts.get(0).get("id")).longValue();
    List<Map<String,Object>> item=db.queryForList("select id,quantity from cart_items where cart_id=? and product_id=?",cartId,p);
    if(item.isEmpty()) db.update("insert into cart_items(cart_id,product_id,quantity) values(?,?,?)",cartId,p,q);
    else db.update("update cart_items set quantity=quantity+? where id=?",q,item.get(0).get("id"));
    return cart(h);
  }

  @PutMapping("/cart/items/{id}")
  public List<Map<String,Object>> updateCart(@RequestHeader("Authorization") String h,@PathVariable long id,@RequestBody Map<String,Object> b) {
    long u=uid(h);
    db.update("update cart_items set quantity=? where id=? and cart_id in(select id from carts where user_id=?)",b.get("quantity"),id,u);
    return cart(h);
  }

  @DeleteMapping("/cart/items/{id}")
  public List<Map<String,Object>> deleteCart(@RequestHeader("Authorization") String h,@PathVariable long id) {
    long u=uid(h);
    db.update("delete from cart_items where id=? and cart_id in(select id from carts where user_id=?)",id,u);
    return cart(h);
  }

  @DeleteMapping("/cart")
  public Map<String,Object> clearCart(@RequestHeader("Authorization") String h) {
    long u=uid(h); db.update("delete from cart_items where cart_id in(select id from carts where user_id=?)",u);
    return Map.of("success",true);
  }

  @GetMapping("/wishlist")
  public List<Map<String,Object>> wishlist(@RequestHeader("Authorization") String h) {
    return db.queryForList("select w.id,w.product_id,p.name,p.price,p.image_url from wishlists w join products p on p.id=w.product_id where w.user_id=? order by w.id desc",uid(h));
  }

  @PostMapping("/wishlist/items/{productId}")
  public List<Map<String,Object>> addWishlist(@RequestHeader("Authorization") String h,@PathVariable long productId) {
    long u=uid(h);
    if(db.queryForList("select id from wishlists where user_id=? and product_id=?",u,productId).isEmpty())
      db.update("insert into wishlists(user_id,product_id) values(?,?)",u,productId);
    return wishlist(h);
  }

  @DeleteMapping("/wishlist/items/{productId}")
  public List<Map<String,Object>> removeWishlist(@RequestHeader("Authorization") String h,@PathVariable long productId) {
    db.update("delete from wishlists where user_id=? and product_id=?",uid(h),productId);
    return wishlist(h);
  }

  @GetMapping("/orders")
  public List<Map<String,Object>> orders(@RequestHeader("Authorization") String h) {
    return db.queryForList("select * from orders where user_id=? order by created_at desc",uid(h));
  }

  @GetMapping("/orders/{id}")
  public Map<String,Object> order(@RequestHeader("Authorization") String h,@PathVariable long id) {
    return db.queryForMap("select * from orders where id=? and user_id=?",id,uid(h));
  }

  @PostMapping("/orders")
  public Map<String,Object> createOrder(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object> b) {
    long u=uid(h);
    double total=((Number)b.getOrDefault("total",0)).doubleValue();
    String number="MRT-"+System.currentTimeMillis();
    db.update("insert into orders(user_id,order_number,total,shipping_address,status,payment_status) values(?,?,?,?,?,?)",u,number,total,b.get("shippingAddress"),"Processing","Pending");
    Long id=db.queryForObject("select max(id) from orders where user_id=?",Long.class,u);
    return order(h,id);
  }

  @PostMapping("/orders/{id}/cancel")
  public Map<String,Object> cancelOrder(@RequestHeader("Authorization") String h,@PathVariable long id) {
    db.update("update orders set status='Cancelled' where id=? and user_id=? and status in('Processing','Pending')",id,uid(h));
    return order(h,id);
  }

  @GetMapping("/orders/{id}/tracking")
  public Map<String,Object> tracking(@RequestHeader("Authorization") String h,@PathVariable long id) {
    return db.queryForMap("select id,order_number,status,payment_status,created_at from orders where id=? and user_id=?",id,uid(h));
  }

  @GetMapping("/custom-orders")
  public List<Map<String,Object>> customOrders(@RequestHeader("Authorization") String h) {
    return db.queryForList("select * from custom_orders where user_id=? order by created_at desc",uid(h));
  }

  @PostMapping("/custom-orders")
  public Map<String,Object> createCustomOrder(@RequestHeader(value="Authorization",required=false) String h,@RequestBody Map<String,Object> b) {
    Long u=h==null?null:uid(h);
    db.update("insert into custom_orders(user_id,name,email,phone,product,quantity,details,budget,status) values(?,?,?,?,?,?,?,?,?)",
      u,b.get("name"),b.get("email"),b.get("phone"),b.get("product"),b.getOrDefault("quantity",b.getOrDefault("qty",1)),b.get("details"),b.get("budget"),"New");
    return Map.of("success",true);
  }

  @GetMapping("/custom-orders/{id}")
  public Map<String,Object> customOrder(@RequestHeader("Authorization") String h,@PathVariable long id) {
    return db.queryForMap("select * from custom_orders where id=? and user_id=?",id,uid(h));
  }

  @PostMapping("/custom-orders/{id}/messages")
  public Map<String,Object> customMessage(@RequestHeader("Authorization") String h,@PathVariable long id,@RequestBody Map<String,Object> b) {
    uid(h); return Map.of("success",true,"customOrderId",id,"message",b.get("message"));
  }

  @GetMapping("/quotations")
  public List<Map<String,Object>> quotations(@RequestHeader("Authorization") String h) {
    return db.queryForList("select * from quotations where user_id=? order by created_at desc",uid(h));
  }

  @GetMapping("/quotations/{id}")
  public Map<String,Object> quotation(@RequestHeader("Authorization") String h,@PathVariable long id) {
    return db.queryForMap("select * from quotations where id=? and user_id=?",id,uid(h));
  }

  @PostMapping("/quotations/{id}/accept")
  public Map<String,Object> acceptQuotation(@RequestHeader("Authorization") String h,@PathVariable long id) {
    db.update("update quotations set status='Accepted' where id=? and user_id=?",id,uid(h));
    return quotation(h,id);
  }

  @GetMapping("/notifications")
  public List<Map<String,Object>> notifications(@RequestHeader("Authorization") String h) {
    return db.queryForList("select * from notifications where user_id=? or user_id is null order by created_at desc",uid(h));
  }

  @PatchMapping("/notifications/{id}/read")
  public Map<String,Object> readNotification(@RequestHeader("Authorization") String h,@PathVariable long id) {
    db.update("update notifications set read_flag=true where id=? and (user_id=? or user_id is null)",id,uid(h));
    return Map.of("success",true);
  }

  @PatchMapping("/notifications/read-all")
  public Map<String,Object> readAllNotifications(@RequestHeader("Authorization") String h) {
    db.update("update notifications set read_flag=true where user_id=?",uid(h));
    return Map.of("success",true);
  }

  @GetMapping("/reviews/product/{productId}")
  public List<Map<String,Object>> reviews(@PathVariable long productId) {
    return db.queryForList("select r.*,u.name user_name from reviews r join users u on u.id=r.user_id where r.product_id=? and r.status in('PUBLISHED','APPROVED') order by r.created_at desc",productId);
  }

  @PostMapping("/reviews")
  public Map<String,Object> createReview(@RequestHeader("Authorization") String h,@RequestBody Map<String,Object> b) {
    db.update("insert into reviews(user_id,product_id,rating,title,body,status) values(?,?,?,?,?,'PENDING')",uid(h),b.get("productId"),b.get("rating"),b.get("title"),b.getOrDefault("body",b.get("comment")));
    return Map.of("success",true,"message","Review submitted for moderation");
  }
}
