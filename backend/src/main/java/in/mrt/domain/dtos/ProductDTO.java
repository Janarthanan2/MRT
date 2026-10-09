package in.mrt.domain.dtos;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private Long brandId;
    private Long categoryId;
    private String sku;
    private String material;
    private Double weight;
    private String weightUnit;
    private String dimensions;
    private String finish;
    private BigDecimal price;
    private Double discountPercentage;
    private Double taxPercentage;
    private Integer minimumOrderQuantity;
    private boolean isCustomizable;
    private boolean isActive;
    private String searchKeywords;
    private Double ratingAverage;
    private Integer reviewCount;
}
