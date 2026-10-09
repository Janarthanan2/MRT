package in.mrt.domain.dtos;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDTO {
    private Long id;
    private String sku;
    private String variantName;
    private BigDecimal price;
    private BigDecimal weight;
    private String weightUnit;
    private String attributes;
    private boolean isActive;
}
