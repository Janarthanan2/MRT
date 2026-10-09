package in.mrt.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku", nullable = false)
    private String sku;

    @Column(name = "variant_name", nullable = false)
    private String variantName;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "weight")
    private BigDecimal weight;

    @Column(name = "weight_unit")
    private String weightUnit;

    @Column(name = "attributes", columnDefinition = "json", nullable = true)
    private String attributes;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;


    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();


    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

}
