# Technical notes

## Stock management & orders
- `laRama_backend/controllers/orderController.js` wraps checkout in a PostgreSQL transaction.
- It validates stock for every cart item, writes `orders` + `order_items`, decrements `products.stock_quantity` with a safety check (`stock_quantity >= quantity`), and clears the cart.

## WhatsApp checkout
- Frontend builds a WhatsApp deep-link using cart/order data and `VITE_WHATSAPP_NUMBER`. This preserves conversational checkout without storing payment details.

## Security & validation
- REST: JWT auth via `middleware/auth.js`; input validation via `middleware/validation.js`; global error handler in `server.js`.
- GraphQL: `AdminGuard` checks `x-admin-key` header before executing resolvers (`src/product/guards/admin.guard.ts`).
- CORS: Express uses `FRONTEND_URL`; Nest GraphQL allows `http://localhost:5173` by default.

## Modularity (NestJS)
- `AppModule` wires `GraphQLModule`, `TypeOrmModule`, and feature `ProductModule`.
- `ProductModule` exports service/resolver/guard; `getTypeOrmConfig` centralizes DB config.

## Documentation approach
- Rich JSDoc/TSDoc blocks live alongside controllers, resolvers, and services.
- For quick references, see `docs/API_REST.md`, `docs/API_GRAPHQL.md`, and `docs/DB_SCHEMA.md`.
