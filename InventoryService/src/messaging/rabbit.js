import amqp from 'amqplib';
import { tryReserveItems } from '../services/inventoryService.js';

const EXCHANGE = process.env.RABBITMQ_EXCHANGE || 'order.exchange';
const RK_ORDER_CREATED = process.env.RK_ORDER_CREATED || 'order.created';
const RK_STOCK_RESERVED = process.env.RK_STOCK_RESERVED || 'stock.reserved';
const RK_STOCK_REJECTED = process.env.RK_STOCK_REJECTED || 'stock.rejected';
const ORDER_CREATED_QUEUE = process.env.ORDER_CREATED_QUEUE || 'order.created.queue';

let channel;

function connUrl() {
  const host = process.env.RABBITMQ_HOST || 'rabbitmq';
  const port = process.env.RABBITMQ_PORT || '5672';
  const user = process.env.RABBITMQ_USERNAME || 'admin';
  const pass = process.env.RABBITMQ_PASSWORD || 'admin';
  return `amqp://${user}:${pass}@${host}:${port}`;
}

export async function initRabbit() {
  const conn = await amqp.connect(connUrl());
  channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  await channel.assertQueue(ORDER_CREATED_QUEUE, { durable: true });
  await channel.bindQueue(ORDER_CREATED_QUEUE, EXCHANGE, RK_ORDER_CREATED);

  await channel.consume(ORDER_CREATED_QUEUE, async (msg) => {
    if (!msg) return;
    try {
      const content = JSON.parse(msg.content.toString());
      const { orderId, correlationId, items } = content;
      const normalized = (items || []).map(i => ({ productId: i.productId, quantity: i.quantity }));
      const result = await tryReserveItems(normalized);

      if (result.ok) {
        const payload = {
          eventType: 'StockReserved',
          orderId,
          correlationId,
          reservedItems: normalized,
          reservedAt: new Date().toISOString()
        };
        channel.publish(EXCHANGE, RK_STOCK_RESERVED, Buffer.from(JSON.stringify(payload)), { persistent: true });
      } else {
        const payload = {
          eventType: 'StockRejected',
          orderId,
          correlationId,
          reason: result.reason || 'Unknown reason',
          rejectedAt: new Date().toISOString()
        };
        channel.publish(EXCHANGE, RK_STOCK_REJECTED, Buffer.from(JSON.stringify(payload)), { persistent: true });
      }

      channel.ack(msg);
    } catch (err) {
      console.error('Error processing message', err);
      // Nack and requeue for retry
      channel.nack(msg, false, true);
    }
  }, { noAck: false });

  console.log('RabbitMQ initialized and consuming OrderCreated');
}

export function publishStockReserved(payload) {
  if (!channel) throw new Error('Rabbit channel not initialized');
  channel.publish(EXCHANGE, RK_STOCK_RESERVED, Buffer.from(JSON.stringify(payload)), { persistent: true });
}

export function publishStockRejected(payload) {
  if (!channel) throw new Error('Rabbit channel not initialized');
  channel.publish(EXCHANGE, RK_STOCK_REJECTED, Buffer.from(JSON.stringify(payload)), { persistent: true });
}
