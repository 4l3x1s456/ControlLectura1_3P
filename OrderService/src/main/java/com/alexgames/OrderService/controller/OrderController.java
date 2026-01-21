package com.alexgames.OrderService.controller;

import com.alexgames.OrderService.dto.CreateOrderRequest;
import com.alexgames.OrderService.dto.OrderResponse;
import com.alexgames.OrderService.model.OrderStatus;
import com.alexgames.OrderService.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req) {
        OrderResponse resp = orderService.createOrder(req);
        return ResponseEntity.accepted().body(resp);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> get(@PathVariable UUID orderId) {
        Optional<OrderResponse> resp = orderService.getOrder(orderId);
        return resp.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable UUID orderId, @RequestParam("status") OrderStatus status) {
        Optional<OrderResponse> resp = orderService.updateOrderStatus(orderId, status);
        return resp.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> delete(@PathVariable UUID orderId) {
        boolean deleted = orderService.deleteOrder(orderId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
