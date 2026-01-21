package com.alexgames.OrderService.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.UUID;

public record CreateOrderRequest(
        @NotNull UUID customerId,
        @NotNull List<Item> items,
        String paymentReference
) {
    public static record Item(@NotNull UUID productId, @NotNull @Positive Integer quantity) {}
}
