import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

export const ProductStock = sequelize.define('ProductStock', {
  productId: {
    type: DataTypes.UUID,
    field: 'product_id',
    primaryKey: true,
    allowNull: false,
  },
  availableStock: {
    type: DataTypes.INTEGER,
    field: 'available_stock',
    allowNull: false,
    defaultValue: 0,
  },
  reservedStock: {
    type: DataTypes.INTEGER,
    field: 'reserved_stock',
    allowNull: false,
    defaultValue: 0,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'products_stock',
  timestamps: false,
});
