import express from 'express';
import { getProductStock, updateProductStock, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/:productId/stock', getProductStock);
router.put('/:productId/stock', updateProductStock);
router.delete('/:productId', deleteProduct);

export default router;
