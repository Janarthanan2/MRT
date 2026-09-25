package in.mrt.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class StoreController {
  private final JdbcTemplate db;
  public StoreController(JdbcTemplate db){this.db=db;}

  @GetMapping("/products")
  public List<Map<String,Object>> products(@RequestParam(required=false) String search,@RequestParam(required=false) Long categoryId){
    String q="select p.*,c.name category from products p left join categories c on c.id=p.category_id where p.status='ACTIVE'";
    List<Object> a=new ArrayList<>();
    if(search!=null&&!search.isBlank()){q+=" and (lower(p.name) like ? or lower(coalesce(p.description,'')) like ? or lower(coalesce(c.name,'')) like ?)";String s="%"+search.toLowerCase()+"%";a.add(s);a.add(s);a.add(s);}
    if(categoryId!=null){q+=" and p.category_id=?";a.add(categoryId);}
    q+=" order by p.featured desc,p.id desc";
    return db.queryForList(q,a.toArray());
  }

  @GetMapping("/products/{id}") public Map<String,Object> product(@PathVariable Long id){
    return db.queryForMap("select p.*,c.name category from products p left join categories c on c.id=p.category_id where p.id=?",id);
  }

  @GetMapping("/products/featured") public List<Map<String,Object>> featured(){
    return db.queryForList("select p.*,c.name category from products p left join categories c on c.id=p.category_id where p.status='ACTIVE' and p.featured=true order by p.id desc");
  }

  @GetMapping("/products/offers") public List<Map<String,Object>> offers(){
    return db.queryForList("select p.*,c.name category from products p left join categories c on c.id=p.category_id where p.status='ACTIVE' and p.original_price is not null and p.original_price>p.price order by p.id desc");
  }

  @GetMapping("/categories") public List<Map<String,Object>> categories(){
    return db.queryForList("select * from categories where active=true and status='ACTIVE' order by name");
  }

  @GetMapping("/categories/{id}") public Map<String,Object> category(@PathVariable Long id){
    return db.queryForMap("select * from categories where id=?",id);
  }

  @GetMapping("/categories/{id}/image") public Map<String,Object> categoryImage(@PathVariable Long id){
    return db.queryForMap("select id,image_url from categories where id=?",id);
  }

  @GetMapping("/products/{id}/images") public List<Map<String,Object>> images(@PathVariable Long id){
    List<Map<String,Object>> rows=db.queryForList("select id,image_url,sort_order from product_images where product_id=? order by sort_order,id",id);
    if(rows.isEmpty()) {
      List<Map<String,Object>> product=db.queryForList("select id,image_url from products where id=? and image_url is not null",id);
      return product;
    }
    return rows;
  }
}
