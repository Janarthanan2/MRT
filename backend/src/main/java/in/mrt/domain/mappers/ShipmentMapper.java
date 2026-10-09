package in.mrt.domain.mappers;

import in.mrt.domain.dtos.ShipmentDTO;
import in.mrt.domain.entities.Shipment;
import org.springframework.stereotype.Component;

@Component
public class ShipmentMapper {

    public ShipmentDTO toDTO(Shipment shipment) {
        if (shipment == null) {
            return null;
        }

        return ShipmentDTO.builder()
                .id(shipment.getId())
                .orderId(shipment.getOrder() != null ? shipment.getOrder().getId() : null)
                .trackingNumber(shipment.getTrackingNumber())
                .status(shipment.getStatus() != null ? shipment.getStatus().toString() : null)
                .createdAt(shipment.getCreatedAt() != null ? shipment.getCreatedAt().toString() : null)
                .updatedAt(shipment.getUpdatedAt() != null ? shipment.getUpdatedAt().toString() : null)
                .build();
    }
}