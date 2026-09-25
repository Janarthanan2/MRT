package in.mrt;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataSeeder {
  @Bean
  CommandLineRunner seed(JdbcTemplate db) {
    return args -> {
      if (db.queryForObject("select count(*) from categories", Long.class) == 0) {
        String[] cats={"Brass Pooja Items","Brass Lamps & Diyas","Brass Statues & Idols","Brass Home Décor","Brass Vessels & Traditional Items","Brass Gifts","Indian Antiques","Antique-Style Collectibles"};
        for(String c:cats) db.update("insert into categories(name,active,status) values(?,true,'ACTIVE')",c);
      }
      if (db.queryForObject("select count(*) from products", Long.class) == 0) {
        add(db,"Dancing Ganesha Brass Idol",3,2499,3299,48,true,"Bestseller","Puja & Festivals");
        add(db,"Traditional Brass Puja Thali Set",1,1899,2499,32,true,null,"Daily Puja");
        add(db,"Antique Brass Hanging Diya",2,1299,null,25,true,"New Arrival","Diwali & Puja");
        add(db,"Brass Urli Bowl — Floral Rim",4,3299,4199,18,true,null,"Home Décor");
        add(db,"Engraved Brass Kalash",5,1499,null,20,true,null,"Religious Ceremonies");
        add(db,"Brass Krishna Flute Player Idol",3,2899,null,16,true,"Top Rated","Janmashtami & Gifting");
        add(db,"Brass Temple Bell — Medium",1,799,999,40,true,null,"Daily Puja");
        add(db,"Brass Plate — Madhubani Motif",6,1899,null,22,true,null,"Corporate & Festival Gifts");
        add(db,"Kuthu Vilakku — Antique Brass Lamp",2,4499,null,0,false,"Limited Stock","Weddings & Temples");
        add(db,"Peacock Brass Incense Holder",1,599,null,50,true,null,"Daily Puja");
        add(db,"Brass Lakshmi Idol — Seated Pose",3,3199,null,14,true,null,"Diwali & Housewarming");
        add(db,"Mughal Brass Jewelry Box",8,1799,2299,19,true,null,"Gifting");
      }
    };
  }
  private void add(JdbcTemplate db,String name,int category,double price,Integer original,int stock,boolean featured,String badge,String occasion) {
    db.update("insert into products(name,category_id,sku,price,original_price,stock,status,featured,badge,occasion) values(?,?,?,?,?,?,?,?,?,?)",
      name,category,"MRT-"+Math.abs(name.hashCode()),price,original,stock,stock>0?"ACTIVE":"OUT_OF_STOCK",featured,badge,occasion);
  }
}
