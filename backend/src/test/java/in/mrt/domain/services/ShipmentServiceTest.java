package in.mrt.domain.services;

import in.mrt.domain.dtos.ShipmentDTO;
import in.mrt.domain.entities.Shipment;
import in.mrt.domain.mappers.ShipmentMapper;
import in.mrt.domain.repositories.ShipmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ShipmentServiceTest {

    @Mock
    private ShipmentRepository shipmentRepository;

    @Mock
    private ShipmentMapper shipmentMapper;

    @InjectMocks
    private ShipmentService shipmentService;

    @Test
    void getShipment_Success_ReturnsDTO() {
        Shipment shipment = Shipment.builder().id(1L).build();
        ShipmentDTO dto = ShipmentDTO.builder().id(1L).build();

        when(shipmentRepository.findById(1L)).thenReturn(Optional.of(shipment));
        when(shipmentMapper.toDTO(shipment)).thenReturn(dto);

        ShipmentDTO result = shipmentService.getShipmentById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(shipmentRepository).findById(1L);
        verify(shipmentMapper).toDTO(shipment);
    }

    @Test
    void getShipment_NotFound_ThrowsException() {
        when(shipmentRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> shipmentService.getShipmentById(99L));
    }
}
