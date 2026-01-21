# E-commerce Microservices (Order & Inventory) with RabbitMQ

## Overview

- OrderService: Spring Boot 3, JPA (Postgres), AMQP
- InventoryService: Node.js 18, Express, Sequelize (Postgres), AMQP
- RabbitMQ: Asynchronous messaging using topic exchange `order.exchange`

## Quick Start (Docker)

1. Ensure Docker Desktop is running.
2. From the project root run:

```bash
docker compose up --build
```

Services:

- RabbitMQ Management: http://localhost:15672 (admin/admin)
- OrderService API: http://localhost:8080
- InventoryService API: http://localhost:3000

## API

- Create Order:

```bash
curl -X POST http://localhost:8080/api/v1/orders \
	-H "Content-Type: application/json" \
	-d '{
		"customerId": "9f7a1e2a-31f6-4a53-b0d2-6f4f1c7a3b2e",
		"items": [
			{"productId": "a3c2b1d0-6b0e-4f2b-9c1a-2d3f4a5b6c7d", "quantity": 2},
			{"productId": "b7e8c9d1-2f3a-4b5c-8d9e-1a2b3c4d5e6f", "quantity": 1}
		],
		"paymentReference": "pay_abc123"
	}'
```

- Get Order Status:

```bash
curl http://localhost:8080/api/v1/orders/{orderId}
```

- Check Stock:
 - Update Order Status (PUT):

```bash
curl -X PUT "http://localhost:8080/api/v1/orders/{orderId}?status=CANCELLED"
```

- Delete Order:

```bash
curl -X DELETE "http://localhost:8080/api/v1/orders/{orderId}"
```

- Update Stock (PUT):

```bash
curl -X PUT http://localhost:3000/api/v1/products/{productId}/stock \
	-H "Content-Type: application/json" \
	-d '{
		"availableStock": 7
	}'
```

- Delete Product:

```bash
curl -X DELETE http://localhost:3000/api/v1/products/{productId}
```

```bash
curl http://localhost:3000/api/v1/products/a3c2b1d0-6b0e-4f2b-9c1a-2d3f4a5b6c7d/stock
```

## RabbitMQ

- Exchange: `order.exchange`
- Routing keys: `order.created`, `stock.reserved`, `stock.rejected`
- Queues:
  - `order.created.queue` (InventoryService consumer)
  - `stock.response.queue` (OrderService consumer)

## Databases

- OrderService: tables `orders`, `order_items` initialized via mounted SQL.
- InventoryService: table `products_stock` with sample data.

## Postman

See `postman_collection.json` for endpoints and example payloads.
