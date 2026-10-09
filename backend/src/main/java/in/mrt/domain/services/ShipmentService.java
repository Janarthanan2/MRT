package in.mrt.domain.services;

import in.mrt.domain.dtos.ShipmentDTO;
import in.mrt.domain.entities.Order;
import in.mrt.domain.entities.Shipment;
import in.mrt.domain.entities.ShipmentStatus;
import in.mrt.domain.mappers.ShipmentMapper;
import in.mrt.domain.repositories.OrderRepository;
import in.mrt.domain.repositories.ShipmentRepository;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Builder
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    private final ShipmentMapper shipmentMapper;

    @Transactional
    public ShipmentDTO createShipment(Long orderId, String trackingNumber) {
        Order order = orderRepository.findById(orderId).orElseThrow();

        Shipment shipment = Shipment.builder()
                .order(order)
                .trackingNumber(trackingNumber)
                .status(ShipmentStatus.PROCESSING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        shipmentRepository.save(shipment);
        return shipmentMapper.toDTO(shipment);
    }

    @Transactional(readOnly = true)
    public ShipmentDTO getShipmentById(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found with id: " + shipmentId));
        return shipmentMapper.toDTO(shipment);
    }

    @Transactional
    public ShipmentDTO updateShipmentStatus(Long shipmentId, String status) {
        Shipment shipment = shipmentRepository.findById(shipmentId).orElseThrow();
        shipment.setStatus(ShipmentStatus.valueOf(status));
        shipment.setUpdatedAt(LocalDateTime.now());
        shipmentRepository.save(shipment);
        return shipmentMapper.toDTO(shipment);
    }
}