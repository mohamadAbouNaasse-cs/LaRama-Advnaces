# Database schema (PostgreSQL)

Schema is defined in `laRama_backend/database.sql` and used by both the REST and GraphQL services.

## Extensions
- `uuid-ossp` for UUID primary keys

## Tables
- **users**: `id UUID PK`, `name`, `email UNIQUE`, `password`, `created_at`, `updated_at`
- **products**: `id UUID PK`, `name`, `description`, `price NUMERIC(10,2)`, `image_url`, `category`, `stock_quantity`, `is_active`, timestamps
- **carts**: `id UUID PK`, `user_id UUID UNIQUE REFERENCES users`
- **cart_items**: `id UUID PK`, `cart_id REFERENCES carts ON DELETE CASCADE`, `product_id REFERENCES products`, `quantity`, `added_at`, unique `(cart_id, product_id)`
- **orders**: `id UUID PK`, `user_id REFERENCES users`, `total_amount`, `status`, `shipping_address`, timestamps
- **order_items**: `id UUID PK`, `order_id REFERENCES orders`, `product_id REFERENCES products ON DELETE SET NULL`, `quantity`, `price`, `created_at`
- **newsletter_subscriptions**: `id UUID PK`, `email UNIQUE`, `status`, `subscription_date`, `unsubscribed_date`, `source`

## Relationships
- `users` 1—1 `carts`
- `carts` 1—N `cart_items`
- `users` 1—N `orders`
- `orders` 1—N `order_items`
- `products` 1—N `cart_items` and `order_items`

## Business rules
- Stock decrements atomically during order creation (`orderController.js` uses transactions and `UPDATE ... WHERE stock_quantity >= quantity`).
- `orders.status` constrained to `pending|processing|shipped|delivered|cancelled`.
- Price snapshots stored on `order_items` to preserve historical totals.
- `updated_at` triggers keep timestamps current across tables.

## Seed data
`database.sql` includes sample products and a test user (`test@larama.com`, password hash for `password123`).
