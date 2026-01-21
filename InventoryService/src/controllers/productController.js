import { getStock, setStock, removeProduct } from '../services/inventoryService.js';

export async function getProductStock(req, res) {
  try {
    const { productId } = req.params;
    const stock = await getStock(productId);
    if (!stock) return res.status(404).json({ message: 'Product not found' });
    return res.json(stock);
  } catch (err) {
    console.error('Error fetching stock', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function updateProductStock(req, res) {
  try {
    const { productId } = req.params;
    const { availableStock } = req.body;
    if (!Number.isInteger(availableStock) || availableStock < 0) {
      return res.status(400).json({ message: 'availableStock must be a non-negative integer' });
    }
    const updated = await setStock(productId, availableStock);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json(updated);
  } catch (err) {
    console.error('Error updating stock', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { productId } = req.params;
    const ok = await removeProduct(productId);
    if (!ok) return res.status(404).json({ message: 'Product not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting product', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
