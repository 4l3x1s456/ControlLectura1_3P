package com.alexgames.OrderService.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String EXCHANGE = "order.exchange";
    public static final String STOCK_RESPONSE_QUEUE = "stock.response.queue";
    public static final String RK_STOCK_RESERVED = "stock.reserved";
    public static final String RK_STOCK_REJECTED = "stock.rejected";

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    @Bean
    public Queue stockResponseQueue() {
        return QueueBuilder.durable(STOCK_RESPONSE_QUEUE).build();
    }

    @Bean
    public Binding stockReservedBinding(Queue stockResponseQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(stockResponseQueue).to(orderExchange).with(RK_STOCK_RESERVED);
    }

    @Bean
    public Binding stockRejectedBinding(Queue stockResponseQueue, TopicExchange orderExchange) {
        return BindingBuilder.bind(stockResponseQueue).to(orderExchange).with(RK_STOCK_REJECTED);
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
