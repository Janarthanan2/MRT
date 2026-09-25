package in.mrt.controller;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api")
public class StoreController {
 private final JdbcTemplate db; public StoreController(JdbcTemplate db){this.db=db;}
 @GetMapping("/products") public List<Map<String,Object>> products(@RequestParam(required=false) String search,@RequestParam(required=false) Long categoryId){
  String q="select p.*,c.name category_name from products p left join categories c on c.id=p.category_id where p.status='ACTIVE'";
  List<Object> a=new ArrayList<>(); if(search!=null&&!search.isBlank()){q+=" and (p.name like ? or p.description like ?)";a.add("%"+search+"%");a.add("%"+search+"%");}
  if(categoryId!=null){q+=" and p.category_id=?";a.add(categoryId);} q+=" order by p.created_at desc"; return db.queryForList(q,a.toArray());
 }
 @GetMapping("/products/{id}") public Map<String,Object> product(@PathVariable Long id){return db.queryForMap("select p.*,c.name category_name from products p left join categories c on c.id=p.category_id where p.id=?",id);}
 @GetMapping("/products/featured") public List<Map<String,Object>> featured(){return db.queryForList("select * from products where status='ACTIVE' and featured=true order by created_at desc");}
 @GetMapping("/products/offers") public List<Map<String,Object>> offers(){return db.queryForList("select * from offers where status='ACTIVE' order by ends_at");}
 @GetMapping("/categories") public List<Map<String,Object>> categories(){return db.queryForList("select * from categories where status='ACTIVE' order by name");}
 @GetMapping("/categories/{id}") public Map<String,Object> category(@PathVariable Long id){return db.queryForMap("select * from categories where id=?",id);}
 @GetMapping("/products/{id}/images") public List<Map<String,Object>> images(@PathVariable Long id){return db.queryForList("select id,image_url from products where id=? and image_url is not null",id);}
 @GetMapping("/categories/{id}/image") public Map<String,Object> categoryImage(@PathVariable Long id){return db.queryForMap("select id,image_url from categories where id=?",id);}
}