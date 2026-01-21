import { tryReserveItems } from '../services/inventoryService.js';
import { publishStockReserved, publishStockRejected } from '../messaging/rabbit.js';

export async function postStockCheck(req, res) {
  try {
    const { orderId, correlationId, items } = req.body || {};
    if (!orderId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'orderId and items[] are required' });
    }
    const normalized = items.map(i => ({ productId: i.productId, quantity: i.quantity }));
    const result = await tryReserveItems(normalized);

    if (result.ok) {
      const payload = {
        eventType: 'StockReserved',
        orderId,
        correlationId: correlationId || crypto.randomUUID(),
        reservedItems: normalized,
        reservedAt: new Date().toISOString()
      };
      publishStockReserved(payload);
      return res.status(200).json({ message: 'Stock reserved and event published', payload });
    } else {
      const payload = {
        eventType: 'StockRejected',
        orderId,
        correlationId: correlationId || crypto.randomUUID(),
        reason: result.reason || 'Insufficient stock',
        rejectedAt: new Date().toISOString()
      };
      publishStockRejected(payload);
      return res.status(200).json({ message: 'Stock rejected and event published', payload });
    }
  } catch (err) {
    console.error('Integration stock check failed', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
