package in.mrt.domain.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private boolean isActive;
}
