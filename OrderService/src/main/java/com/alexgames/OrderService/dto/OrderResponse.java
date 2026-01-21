package com.alexgames.OrderService.dto;

import com.alexgames.OrderService.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID orderId,
        UUID customerId,
        OrderStatus status,
        String paymentReference,
        LocalDateTime updatedAt,
        List<Item> items
) {
    public static record Item(UUID productId, Integer quantity) {}
}
