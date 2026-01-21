package com.alexgames.OrderService.messaging;

import com.alexgames.OrderService.model.Order;
import com.alexgames.OrderService.model.OrderStatus;
import com.alexgames.OrderService.repository.OrderRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
public class StockResponseListener {
    private final OrderRepository orderRepository;

    public StockResponseListener(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.STOCK_RESPONSE_QUEUE)
    public void handleStockResponse(Map<String, Object> message) {
        String eventType = (String) message.get("eventType");
        String orderIdStr = (String) message.get("orderId");
        if (orderIdStr == null) return;
        UUID orderId = UUID.fromString(orderIdStr);

        Optional<Order> opt = orderRepository.findById(orderId);
        if (opt.isEmpty()) return;
        Order order = opt.get();

        if ("StockReserved".equals(eventType)) {
            order.setStatus(OrderStatus.CONFIRMED);
        } else if ("StockRejected".equals(eventType)) {
            order.setStatus(OrderStatus.CANCELLED);
        }
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }
}
