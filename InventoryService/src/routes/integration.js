import express from 'express';
import { postStockCheck } from '../controllers/integrationController.js';

const router = express.Router();

// POST /api/v1/integration/stock-check
router.post('/stock-check', postStockCheck);

export default router;
