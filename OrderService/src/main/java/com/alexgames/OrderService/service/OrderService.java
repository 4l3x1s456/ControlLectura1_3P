package com.alexgames.OrderService.service;

import com.alexgames.OrderService.dto.CreateOrderRequest;
import com.alexgames.OrderService.dto.OrderResponse;
import com.alexgames.OrderService.messaging.OrderEventPublisher;
import com.alexgames.OrderService.model.Order;
import com.alexgames.OrderService.model.OrderItem;
import com.alexgames.OrderService.repository.OrderRepository;
import com.alexgames.OrderService.model.OrderStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderEventPublisher publisher;

    public OrderService(OrderRepository orderRepository, OrderEventPublisher publisher) {
        this.orderRepository = orderRepository;
        this.publisher = publisher;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest req) {
        UUID orderId = UUID.randomUUID();
        Order order = new Order(orderId, req.customerId(), req.paymentReference());

        List<OrderItem> items = req.items().stream()
                .map(i -> new OrderItem(order, i.productId(), i.quantity()))
                .collect(Collectors.toList());
        order.getItems().addAll(items);
        orderRepository.save(order);

        UUID correlationId = UUID.randomUUID();
        List<Map<String, Object>> eventItems = items.stream()
                .map(i -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("productId", i.getProductId().toString());
                    m.put("quantity", i.getQuantity());
                    return m;
                })
                .collect(Collectors.toList());
        publisher.publishOrderCreated(orderId, eventItems, correlationId);

        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public Optional<OrderResponse> getOrder(UUID id) {
        return orderRepository.findById(id).map(this::toResponse);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.Item> items = order.getItems().stream()
                .map(i -> new OrderResponse.Item(i.getProductId(), i.getQuantity()))
                .toList();
        return new OrderResponse(order.getOrderId(), order.getCustomerId(), order.getStatus(),
                order.getPaymentReference(), order.getUpdatedAt(), items);
    }

    @Transactional
    public Optional<OrderResponse> updateOrderStatus(UUID orderId, OrderStatus status) {
        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(status);
            order.setUpdatedAt(java.time.LocalDateTime.now());
            Order saved = orderRepository.save(order);
            return toResponse(saved);
        });
    }

    @Transactional
    public boolean deleteOrder(UUID orderId) {
        if (!orderRepository.existsById(orderId)) return false;
        orderRepository.deleteById(orderId);
        return true;
    }
}
