package in.mrt.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "sku", nullable = false, unique = true)
    private String sku;

    @Column(name = "material")
    private String material;

    @Column(name = "weight")
    private Double weight;

    @Enumerated(EnumType.STRING)
    @Column(name = "weight_unit")
    private WeightUnit weightUnit;

    @Column(name = "dimensions")
    private String dimensions;

    @Column(name = "finish")
    private String finish;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "discount_percentage", nullable = false)
    @Builder.Default
    private Double discountPercentage = 0.0;


    @Column(name = "tax_percentage", nullable = false)
    @Builder.Default
    private Double taxPercentage = 0.0;


    @Column(name = "minimum_order_quantity", nullable = false)
    @Builder.Default
    private Integer minimumOrderQuantity = 1;


    @Column(name = "is_customizable", nullable = false)
    @Builder.Default
    private boolean isCustomizable = false;


    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;


    @Column(name = "search_keywords", columnDefinition = "TEXT")
    private String searchKeywords;

    @Column(name = "rating_average", nullable = false)
    @Builder.Default
    private Double ratingAverage = 0.0;


    @Column(name = "review_count", nullable = false)
    @Builder.Default
    private Integer reviewCount = 0;


    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();


    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

}
