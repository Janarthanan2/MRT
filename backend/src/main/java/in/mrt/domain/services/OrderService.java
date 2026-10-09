package in.mrt.domain.services;

import in.mrt.domain.dtos.OrderDTO;
import in.mrt.domain.entities.Order;
import in.mrt.domain.entities.OrderItem;
import in.mrt.domain.entities.Product;
import in.mrt.domain.entities.ProductVariant;
import in.mrt.domain.entities.OrderStatus;
import in.mrt.domain.entities.User;
import in.mrt.domain.repositories.OrderRepository;
import in.mrt.domain.repositories.OrderItemRepository;
import in.mrt.domain.repositories.ProductRepository;
import in.mrt.domain.repositories.ProductVariantRepository;
import in.mrt.domain.repositories.UserRepository;
import in.mrt.domain.mappers.OrderMapper;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Builder
public class OrderService {


    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        User user = userRepository.findById(orderDTO.getUserId()).orElseThrow();

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .status(OrderStatus.valueOf(orderDTO.getStatus()))
                .subtotal(orderDTO.getSubtotal())
                .discountAmount(orderDTO.getDiscountAmount())
                .taxAmount(orderDTO.getTaxAmount())
                .shippingAmount(orderDTO.getShippingAmount())
                .totalAmount(orderDTO.getTotalAmount())
                .notes(orderDTO.getNotes())
                .build();

        orderRepository.save(order);

        for (in.mrt.domain.dtos.OrderItemDTO itemDTO : orderDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId()).orElseThrow();
            ProductVariant variant = productVariantRepository.findBySku(itemDTO.getSku()).orElseThrow();

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .variant(variant)
                    .quantity(itemDTO.getQuantity())
                    .unitPrice(variant.getPrice())
                    .build();

            orderItemRepository.save(orderItem);
        }

        return orderMapper.toDTO(order);
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id).orElseThrow();
        return orderMapper.toDTO(order);
    }
}

