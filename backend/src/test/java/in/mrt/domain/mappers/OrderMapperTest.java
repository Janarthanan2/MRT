package in.mrt.domain.mappers;

import in.mrt.domain.dtos.OrderDTO;
import in.mrt.domain.entities.Order;
import in.mrt.domain.entities.OrderItem;
import in.mrt.domain.entities.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class OrderMapperTest {

    private OrderMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new OrderMapper();
    }

    @Test
    void toDTO_ValidOrder_ReturnsCorrectDTO() {
        User user = User.builder().id(1L).build();
        Order order = Order.builder()
                .id(1L)
                .orderNumber("ORD-123")
                .status(in.mrt.domain.entities.OrderStatus.PENDING)
                .subtotal(new BigDecimal("100.00"))
                .discountAmount(BigDecimal.ZERO)
                .taxAmount(new BigDecimal("10.00"))
                .shippingAmount(new BigDecimal("5.00"))
                .totalAmount(new BigDecimal("115.00"))
                .notes("Delivery instructions")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(user)
                .items(new ArrayList<>())
                .build();

        OrderDTO dto = mapper.toDTO(order);
        assertNotNull(dto);
        assertEquals("ORD-123", dto.getOrderNumber());
        assertEquals("PENDING", dto.getStatus());
        assertEquals(1L, dto.getUserId());
    }

    @Test
    void toDTO_NullOrder_ReturnsNull() {
        assertNull(mapper.toDTO(null));
    }

    @Test
    void toEntity_ValidDTO_ReturnsCorrectEntity() {
        OrderDTO dto = OrderDTO.builder()
                .orderNumber("ORD-456")
                .userId(2L)
                .status("CONFIRMED")
                .subtotal(new BigDecimal("200.00"))
                .discountAmount(new BigDecimal("10.00"))
                .taxAmount(new BigDecimal("20.00"))
                .shippingAmount(new BigDecimal("5.00"))
                .totalAmount(new BigDecimal("215.00"))
                .notes("Promo")
                .build();

        Order entity = mapper.toEntity(dto);
        assertNotNull(entity);
        assertEquals("ORD-456", entity.getOrderNumber());
        assertEquals(in.mrt.domain.entities.OrderStatus.CONFIRMED, entity.getStatus());
    }
}
