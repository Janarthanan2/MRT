package in.mrt.domain.services;

import in.mrt.domain.dtos.OrderDTO;
import in.mrt.domain.entities.Order;
import in.mrt.domain.mappers.OrderMapper;
import in.mrt.domain.repositories.OrderRepository;
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
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderService orderService;

    @Test
    void getOrder_Success_ReturnsDTO() {
        Order order = Order.builder().id(1L).build();
        OrderDTO dto = OrderDTO.builder().id(1L).build();
        
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderMapper.toDTO(order)).thenReturn(dto);

        OrderDTO result = orderService.getOrderById(1L);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(orderRepository).findById(1L);
    }

    @Test
    void getOrder_NotFound_ThrowsException() {
        when(orderRepository.findById(any())).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> orderService.getOrderById(99L));
    }
}
