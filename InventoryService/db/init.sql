-- InventoryService database initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products_stock (
    product_id UUID PRIMARY KEY,
    available_stock INTEGER NOT NULL DEFAULT 0,
    reserved_stock INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sample data
INSERT INTO products_stock (product_id, available_stock, reserved_stock)
VALUES
  ('a3c2b1d0-6b0e-4f2b-9c1a-2d3f4a5b6c7d', 10, 0),
  ('b7e8c9d1-2f3a-4b5c-8d9e-1a2b3c4d5e6f', 5, 0)
ON CONFLICT (product_id) DO NOTHING;
