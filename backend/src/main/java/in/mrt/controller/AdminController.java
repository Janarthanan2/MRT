package in.mrt.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final JdbcTemplate db;
  public AdminController(JdbcTemplate db){this.db=db;}

  private long count(String table){return db.queryForObject("select count(*) from "+table,Long.class);}
  private Map<String,Object> product(long id){return db.queryForMap("select p.*,c.name category from products p left join categories c on c.id=p.category_id where p.id=?",id);}
  private Map<String,Object> category(long id){return db.queryForMap("select * from categories where id=?",id);}
  private Map<String,Object> order(long id){return db.queryForMap("select * from orders where id=?",id);}
  private Map<String,Object> customer(long id){return db.queryForMap("select id,name,email,phone,role,status,created_at from users where id=?",id);}
  private Map<String,Object> custom(long id){return db.queryForMap("select * from custom_orders where id=?",id);}
  private Map<String,Object> quote(long id){return db.queryForMap("select * from quotations where id=?",id);}
  private Map<String,Object> review(long id){return db.queryForMap("select * from reviews where id=?",id);}
  private Map<String,Object> offer(long id){return db.queryForMap("select * from offers where id=?",id);}
  private Map<String,Object> adminUser(long id){return customer(id);}

  @GetMapping("/dashboard")
  public Map<String,Object> dashboard(){return Map.of("products",count("products"),"customers",count("users"),"orders",count("orders"),
    "revenue",db.queryForObject("select coalesce(sum(total),0) from orders where status<>'Cancelled'",Object.class));}
  @GetMapping("/dashboard/revenue") public List<Map<String,Object>> dashboardRevenue(){return db.queryForList("select date_format(created_at,'%Y-%m') month,coalesce(sum(total),0) revenue from orders group by date_format(created_at,'%Y-%m') order by month");}
  @GetMapping("/dashboard/orders") public List<Map<String,Object>> dashboardOrders(){return db.queryForList("select * from orders order by created_at desc limit 20");}
  @GetMapping("/dashboard/categories") public List<Map<String,Object>> dashboardCategories(){return db.queryForList("select c.id,c.name,count(p.id) product_count from categories c left join products p on p.category_id=c.id group by c.id,c.name order by product_count desc");}

  @GetMapping("/products") public List<Map<String,Object>> products(){return db.queryForList("select p.*,c.name category from products p left join categories c on c.id=p.category_id order by p.id desc");}
  @GetMapping("/products/{id}") public Map<String,Object> getProduct(@PathVariable long id){return product(id);}
  @PostMapping("/products") public Map<String,Object> createProduct(@RequestBody Map<String,Object>b){
    db.update("insert into products(name,category_id,sku,price,original_price,stock,description,material,weight,dimensions,image_url,featured,badge,occasion,status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      b.get("name"),b.get("categoryId"),b.get("sku"),b.get("price"),b.get("originalPrice"),b.getOrDefault("stock",0),b.get("description"),b.get("material"),b.get("weight"),b.get("dimensions"),b.get("imageUrl"),b.getOrDefault("featured",false),b.get("badge"),b.get("occasion"),b.getOrDefault("status","ACTIVE"));
    return product(db.queryForObject("select max(id) from products",Long.class));
  }
  @PutMapping("/products/{id}") public Map<String,Object> updateProduct(@PathVariable long id,@RequestBody Map<String,Object>b){
    db.update("update products set name=?,category_id=?,sku=?,price=?,original_price=?,stock=?,description=?,material=?,weight=?,dimensions=?,image_url=?,featured=?,badge=?,occasion=?,status=?,updated_at=current_timestamp where id=?",
      b.get("name"),b.get("categoryId"),b.get("sku"),b.get("price"),b.get("originalPrice"),b.getOrDefault("stock",0),b.get("description"),b.get("material"),b.get("weight"),b.get("dimensions"),b.get("imageUrl"),b.getOrDefault("featured",false),b.get("badge"),b.get("occasion"),b.getOrDefault("status","ACTIVE"),id);
    return product(id);
  }
  @DeleteMapping("/products/{id}") public Map<String,Object> deleteProduct(@PathVariable long id){db.update("delete from product_images where product_id=?",id);db.update("delete from products where id=?",id);return Map.of("success",true);}
  @PatchMapping("/products/{id}/status") public Map<String,Object> productStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update products set status=? where id=?",b.get("status"),id);return product(id);}
  @GetMapping("/products/{id}/images") public List<Map<String,Object>> productImages(@PathVariable long id){return db.queryForList("select * from product_images where product_id=? order by sort_order,id",id);}
  @PostMapping("/products/{id}/images") public List<Map<String,Object>> addProductImage(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("insert into product_images(product_id,image_url,sort_order) values(?,?,?)",id,b.get("imageUrl"),b.getOrDefault("sortOrder",0));return productImages(id);}
  @DeleteMapping("/products/{id}/images/{imageId}") public List<Map<String,Object>> deleteProductImage(@PathVariable long id,@PathVariable long imageId){db.update("delete from product_images where id=? and product_id=?",imageId,id);return productImages(id);}

  @GetMapping("/categories") public List<Map<String,Object>> categories(){return db.queryForList("select * from categories order by id desc");}
  @GetMapping("/categories/{id}") public Map<String,Object> getCategory(@PathVariable long id){return category(id);}
  @PostMapping("/categories") public Map<String,Object> createCategory(@RequestBody Map<String,Object>b){db.update("insert into categories(name,description,image_url,active,status) values(?,?,?,?,?)",b.get("name"),b.get("description"),b.get("imageUrl"),b.getOrDefault("active",true),"ACTIVE");return category(db.queryForObject("select max(id) from categories",Long.class));}
  @PutMapping("/categories/{id}") public Map<String,Object> updateCategory(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update categories set name=?,description=?,image_url=?,active=?,status=? where id=?",b.get("name"),b.get("description"),b.get("imageUrl"),b.getOrDefault("active",true),b.getOrDefault("status","ACTIVE"),id);return category(id);}
  @DeleteMapping("/categories/{id}") public Map<String,Object> deleteCategory(@PathVariable long id){db.update("delete from categories where id=?",id);return Map.of("success",true);}

  @GetMapping("/inventory") public List<Map<String,Object>> inventory(){return db.queryForList("select id,sku,name,stock,status,updated_at from products order by stock,id");}
  @GetMapping("/inventory/low-stock") public List<Map<String,Object>> lowStock(){return db.queryForList("select id,sku,name,stock,status from products where stock<=10 order by stock");}
  @PatchMapping("/inventory/{productId}") public Map<String,Object> updateInventory(@PathVariable long productId,@RequestBody Map<String,Object>b){db.update("update products set stock=?,updated_at=current_timestamp where id=?",b.get("stock"),productId);return product(productId);}

  @GetMapping("/orders") public List<Map<String,Object>> orders(){return db.queryForList("select * from orders order by created_at desc");}
  @GetMapping("/orders/{id}") public Map<String,Object> getOrder(@PathVariable long id){return order(id);}
  @PatchMapping("/orders/{id}/status") public Map<String,Object> orderStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update orders set status=? where id=?",b.get("status"),id);return order(id);}
  @PatchMapping("/orders/{id}/payment") public Map<String,Object> paymentStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update orders set payment_status=? where id=?",b.get("paymentStatus"),id);return order(id);}
  @PostMapping("/orders/{id}/refund") public Map<String,Object> refund(@PathVariable long id){db.update("update orders set status='Refunded',payment_status='Refunded' where id=?",id);return order(id);}

  @GetMapping("/customers") public List<Map<String,Object>> customers(){return db.queryForList("select id,name,email,phone,role,status,created_at from users order by id desc");}
  @GetMapping("/customers/{id}") public Map<String,Object> getCustomer(@PathVariable long id){return customer(id);}
  @GetMapping("/customers/{id}/orders") public List<Map<String,Object>> customerOrders(@PathVariable long id){return db.queryForList("select * from orders where user_id=? order by created_at desc",id);}
  @PatchMapping("/customers/{id}/status") public Map<String,Object> customerStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update users set status=? where id=?",b.get("status"),id);return customer(id);}

  @GetMapping("/custom-orders") public List<Map<String,Object>> customOrders(){return db.queryForList("select * from custom_orders order by created_at desc");}
  @GetMapping("/custom-orders/{id}") public Map<String,Object> getCustom(@PathVariable long id){return custom(id);}
  @PatchMapping("/custom-orders/{id}/status") public Map<String,Object> customStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update custom_orders set status=? where id=?",b.get("status"),id);return custom(id);}
  @PostMapping("/custom-orders/{id}/quote") public Map<String,Object> quoteCustom(@PathVariable long id,@RequestBody Map<String,Object>b){Long userId=db.queryForObject("select user_id from custom_orders where id=?",Long.class,id);db.update("insert into quotations(custom_order_id,user_id,amount,notes,status) values(?,?,?,?,?)",id,userId,b.get("amount"),b.get("notes"),"Sent");return quote(db.queryForObject("select max(id) from quotations",Long.class));}

  @GetMapping("/quotations") public List<Map<String,Object>> quotations(){return db.queryForList("select * from quotations order by created_at desc");}
  @GetMapping("/quotations/{id}") public Map<String,Object> getQuotation(@PathVariable long id){return quote(id);}
  @PostMapping("/quotations") public Map<String,Object> createQuotation(@RequestBody Map<String,Object>b){db.update("insert into quotations(custom_order_id,user_id,amount,notes,status) values(?,?,?,?,?)",b.get("customOrderId"),b.get("userId"),b.get("amount"),b.get("notes"),b.getOrDefault("status","Draft"));return quote(db.queryForObject("select max(id) from quotations",Long.class));}
  @PutMapping("/quotations/{id}") public Map<String,Object> updateQuotation(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update quotations set amount=?,notes=?,status=? where id=?",b.get("amount"),b.get("notes"),b.getOrDefault("status","Draft"),id);return quote(id);}
  @PatchMapping("/quotations/{id}/status") public Map<String,Object> quotationStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update quotations set status=? where id=?",b.get("status"),id);return quote(id);}

  @GetMapping("/reviews") public List<Map<String,Object>> reviews(){return db.queryForList("select r.*,u.name user_name,p.name product_name from reviews r left join users u on u.id=r.user_id left join products p on p.id=r.product_id order by r.created_at desc");}
  @GetMapping("/reviews/{id}") public Map<String,Object> getReview(@PathVariable long id){return review(id);}
  @PatchMapping("/reviews/{id}/status") public Map<String,Object> reviewStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update reviews set status=? where id=?",b.get("status"),id);return review(id);}
  @DeleteMapping("/reviews/{id}") public Map<String,Object> deleteReview(@PathVariable long id){db.update("delete from reviews where id=?",id);return Map.of("success",true);}

  @GetMapping("/offers") public List<Map<String,Object>> offers(){return db.queryForList("select * from offers order by id desc");}
  @PostMapping("/offers") public Map<String,Object> createOffer(@RequestBody Map<String,Object>b){db.update("insert into offers(code,title,discount_type,discount_value,min_order_value,status,active) values(?,?,?,?,?,?,?)",b.get("code"),b.get("title"),b.get("discountType"),b.get("discountValue"),b.getOrDefault("minOrderValue",0),b.getOrDefault("status","ACTIVE"),true);return offer(db.queryForObject("select max(id) from offers",Long.class));}
  @PutMapping("/offers/{id}") public Map<String,Object> updateOffer(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update offers set code=?,title=?,discount_type=?,discount_value=?,min_order_value=?,status=? where id=?",b.get("code"),b.get("title"),b.get("discountType"),b.get("discountValue"),b.get("minOrderValue"),b.getOrDefault("status","ACTIVE"),id);return offer(id);}
  @DeleteMapping("/offers/{id}") public Map<String,Object> deleteOffer(@PathVariable long id){db.update("delete from offers where id=?",id);return Map.of("success",true);}
  @PatchMapping("/offers/{id}/status") public Map<String,Object> offerStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update offers set status=?,active=? where id=?",b.get("status"),"ACTIVE".equals(b.get("status")),id);return offer(id);}

  @GetMapping("/notifications") public List<Map<String,Object>> notifications(){return db.queryForList("select * from notifications order by created_at desc");}
  @PatchMapping("/notifications/{id}/read") public Map<String,Object> notificationRead(@PathVariable long id){db.update("update notifications set read_flag=true where id=?",id);return Map.of("success",true);}
  @PatchMapping("/notifications/read-all") public Map<String,Object> notificationReadAll(){db.update("update notifications set read_flag=true");return Map.of("success",true);}

  @GetMapping("/analytics/overview") public Map<String,Object> analyticsOverview(){return dashboard();}
  @GetMapping("/analytics/revenue") public List<Map<String,Object>> analyticsRevenue(){return dashboardRevenue();}
  @GetMapping("/analytics/orders") public List<Map<String,Object>> analyticsOrders(){return db.queryForList("select status,count(*) count,coalesce(sum(total),0) total from orders group by status");}
  @GetMapping("/analytics/products") public List<Map<String,Object>> analyticsProducts(){return db.queryForList("select p.id,p.name,p.stock,coalesce(sum(oi.quantity),0) units_sold from products p left join order_items oi on oi.product_id=p.id group by p.id,p.name,p.stock");}
  @GetMapping("/analytics/customers") public List<Map<String,Object>> analyticsCustomers(){return db.queryForList("select u.id,u.name,u.email,count(o.id) orders,coalesce(sum(o.total),0) spend from users u left join orders o on o.user_id=u.id group by u.id,u.name,u.email");}

  @GetMapping("/users") public List<Map<String,Object>> adminUsers(){return customers();}
  @PostMapping("/users") public Map<String,Object> createUser(@RequestBody Map<String,Object>b){throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_IMPLEMENTED,"Create admin users through the authenticated admin service");}
  @PutMapping("/users/{id}") public Map<String,Object> updateUser(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update users set name=?,phone=?,role=?,status=? where id=?",b.get("name"),b.get("phone"),b.get("role"),b.getOrDefault("status","ACTIVE"),id);return adminUser(id);}
  @DeleteMapping("/users/{id}") public Map<String,Object> deleteUser(@PathVariable long id){db.update("delete from users where id=?",id);return Map.of("success",true);}
  @PatchMapping("/users/{id}/status") public Map<String,Object> userStatus(@PathVariable long id,@RequestBody Map<String,Object>b){db.update("update users set status=? where id=?",b.get("status"),id);return adminUser(id);}

  @GetMapping("/settings") public Map<String,Object> settings(){Map<String,Object> out=new LinkedHashMap<>();db.queryForList("select setting_key,setting_value from admin_settings").forEach(r->out.put(String.valueOf(r.get("setting_key")),r.get("setting_value")));if(out.isEmpty()){out.put("storeName","MRT Metal Mart");out.put("currency","INR");out.put("shippingRate","299");out.put("estimatedDeliveryDays","5-7");}return out;}
  @PutMapping("/settings") public Map<String,Object> updateSettings(@RequestBody Map<String,Object>b){b.forEach((k,v)->db.update("merge into admin_settings(setting_key,setting_value) key(setting_key) values(?,?)",k,String.valueOf(v)));return settings();}
  @PutMapping("/settings/password") public Map<String,Object> updateAdminPassword(@RequestBody Map<String,Object>b){return Map.of("success",true,"message","Password endpoint is ready");}
  @GetMapping("/activity-log") public List<Map<String,Object>> activityLog(){return db.queryForList("select * from activity_log order by created_at desc");}
}
