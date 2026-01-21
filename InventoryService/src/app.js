import 'dotenv/config';
import express from 'express';
import productsRouter from './routes/products.js';
import integrationRouter from './routes/integration.js';
import { initRabbit } from './messaging/rabbit.js';
import { initDb } from './models/index.js';

const app = express();
app.use(express.json());

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/integration', integrationRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();
  await initRabbit();
  app.listen(PORT, () => {
    console.log(`Inventory Service running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start Inventory Service', err);
  process.exit(1);
});
