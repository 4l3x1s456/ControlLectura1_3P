import { ProductStock } from '../models/productStock.js';

export async function getStock(productId) {
  const stock = await ProductStock.findByPk(productId);
  if (!stock) return null;
  return {
    productId: stock.productId,
    availableStock: stock.availableStock,
    reservedStock: stock.reservedStock,
    updatedAt: stock.updatedAt,
  };
}

export async function tryReserveItems(items) {
  // items: [{productId, quantity}]
  const t = await ProductStock.sequelize.transaction();
  try {
    // Check all products first
    for (const { productId, quantity } of items) {
      const row = await ProductStock.findByPk(productId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!row || row.availableStock < quantity) {
        await t.rollback();
        return { ok: false, reason: `Insufficient stock for ${productId}` };
      }
    }
    // Reserve
    for (const { productId, quantity } of items) {
      const row = await ProductStock.findByPk(productId, { transaction: t, lock: t.LOCK.UPDATE });
      row.availableStock -= quantity;
      row.reservedStock += quantity;
      row.updatedAt = new Date();
      await row.save({ transaction: t });
    }
    await t.commit();
    return { ok: true };
  } catch (err) {
    await t.rollback();
    return { ok: false, reason: err.message };
  }
}

export async function setStock(productId, availableStock) {
  const row = await ProductStock.findByPk(productId);
  if (!row) return null;
  row.availableStock = availableStock;
  row.updatedAt = new Date();
  await row.save();
  return {
    productId: row.productId,
    availableStock: row.availableStock,
    reservedStock: row.reservedStock,
    updatedAt: row.updatedAt
  };
}

export async function removeProduct(productId) {
  const deleted = await ProductStock.destroy({ where: { productId } });
  return deleted > 0;
}
