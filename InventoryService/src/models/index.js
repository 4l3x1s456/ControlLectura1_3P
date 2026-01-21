import { Sequelize } from 'sequelize';

const dbHost = process.env.DB_HOST || 'inventory-db';
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || 'inventorydb';
const dbUser = process.env.DB_USER || 'inventoryuser';
const dbPass = process.env.DB_PASS || 'inventorypass';

export const sequelize = new Sequelize(`postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`, {
  logging: false,
});

export async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('Connected to Inventory DB');
  } catch (err) {
    console.error('DB connection failed', err);
    throw err;
  }
}
