package in.mrt.domain.mappers;

import in.mrt.domain.dtos.OrderDTO;
import in.mrt.domain.dtos.OrderItemDTO;
import in.mrt.domain.entities.Order;
import in.mrt.domain.entities.OrderItem;
import in.mrt.domain.entities.OrderStatus;
import in.mrt.domain.entities.Product;
import in.mrt.domain.entities.ProductVariant;
import in.mrt.domain.entities.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        if (order == null) return null;

        List<OrderItemDTO> items = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                OrderItemDTO itemDTO = OrderItemDTO.builder()
                        .id(item.getId())
                        .orderId(order.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                        .productName(item.getProductName())
                        .sku(item.getSku())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .discountAmount(item.getDiscountAmount())
                        .taxAmount(item.getTaxAmount())
                        .subtotal(item.getSubtotal())
                        .build();
                items.add(itemDTO);
            }
        }

        return OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .status(order.getStatus() != null ? order.getStatus().toString() : null)
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .taxAmount(order.getTaxAmount())
                .shippingAmount(order.getShippingAmount())
                .totalAmount(order.getTotalAmount())
                .notes(order.getNotes())
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    public Order toEntity(OrderDTO dto) {
        if (dto == null) return null;

        Order order = Order.builder()
                .id(dto.getId())
                .orderNumber(dto.getOrderNumber())
                .user(dto.getUserId() != null ? User.builder().id(dto.getUserId()).build() : null)
                .status(dto.getStatus() != null ? OrderStatus.valueOf(dto.getStatus()) : OrderStatus.PENDING)
                .subtotal(dto.getSubtotal())
                .discountAmount(dto.getDiscountAmount())
                .taxAmount(dto.getTaxAmount())
                .shippingAmount(dto.getShippingAmount())
                .totalAmount(dto.getTotalAmount())
                .notes(dto.getNotes())
                .createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now())
                .updatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now())
                .items(new ArrayList<>())
                .build();

        if (dto.getItems() != null) {
            for (OrderItemDTO itemDTO : dto.getItems()) {
                OrderItem item = OrderItem.builder()
                        .id(itemDTO.getId())
                        .order(order)
                        .product(itemDTO.getProductId() != null ? Product.builder().id(itemDTO.getProductId()).build() : null)
                        .variant(itemDTO.getVariantId() != null ? ProductVariant.builder().id(itemDTO.getVariantId()).build() : null)
                        .productName(itemDTO.getProductName())
                        .sku(itemDTO.getSku())
                        .quantity(itemDTO.getQuantity())
                        .unitPrice(itemDTO.getUnitPrice())
                        .discountAmount(itemDTO.getDiscountAmount())
                        .taxAmount(itemDTO.getTaxAmount())
                        .subtotal(itemDTO.getSubtotal())
                        .build();
                order.getItems().add(item);
            }
        }

        return order;
    }
}
