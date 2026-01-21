package com.alexgames.OrderService.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class OrderEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.order-created-key:order.created}")
    private String orderCreatedRoutingKey;

    public OrderEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishOrderCreated(UUID orderId, List<Map<String, Object>> items, UUID correlationId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "OrderCreated");
        payload.put("orderId", orderId.toString());
        payload.put("correlationId", correlationId.toString());
        payload.put("createdAt", OffsetDateTime.now().toString());
        payload.put("items", items);

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, orderCreatedRoutingKey, payload);
    }
}
