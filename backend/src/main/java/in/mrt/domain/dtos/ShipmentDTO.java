package in.mrt.domain.dtos;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentDTO {
    private Long id;
    private Long orderId;
    private String courier;
    private String trackingNumber;
    private String status;
    private java.sql.Date estimatedDelivery;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private String createdAt;
    private String updatedAt;
}
