# REST API (Express, port 5000)

The customer-facing REST API powers authentication, catalog browsing, cart/checkout, and newsletter flows.

- Base URL: `http://localhost:5000`
- Auth: JWT (`Authorization: Bearer <token>`) for protected routes
- Content-Type: `application/json`
- CORS: allow `FRONTEND_URL` from `.env`

## Endpoint catalog

| Area | Method & Path | Auth | Notes |
| --- | --- | --- | --- |
| Health | `GET /` | None | Returns API status + endpoint map |
| Auth | `POST /api/auth/register` | None | Body `{ name, email, password }` |
| Auth | `POST /api/auth/login` | None | Body `{ email, password }` |
| Auth | `GET /api/auth/profile` | JWT | Current user profile |
| Auth | `GET /api/auth/verify-token` | JWT | Validate token & return user |
| Products | `GET /api/products` | Optional | Query params support filtering/pagination |
| Products | `GET /api/products/categories` | Optional | Distinct categories with counts |
| Products | `GET /api/products/featured` | Optional | Featured/newest products |
| Products | `GET /api/products/:id` | Optional | Product details |
| Cart | `GET /api/cart` | JWT | Current user cart |
| Cart | `POST /api/cart/add` | JWT | Body `{ product_id, quantity }` |
| Cart | `PUT /api/cart/items/:cart_item_id` | JWT | Body `{ quantity }` |
| Cart | `DELETE /api/cart/items/:cart_item_id` | JWT | Remove single item |
| Cart | `DELETE /api/cart/clear` | JWT | Clear all items (alias: `DELETE /api/cart`) |
| Orders | `POST /api/orders` | JWT | Body `{ shipping_address }`; creates order, decrements stock |
| Orders | `GET /api/orders` | JWT | User order history |
| Orders | `GET /api/orders/stats` | JWT | Aggregate order stats |
| Orders | `GET /api/orders/:order_id` | JWT | Order detail |
| Newsletter | `POST /api/newsletter/subscribe` | None | Body `{ email }` |
| Newsletter | `POST /api/newsletter/unsubscribe` | None | Body `{ email }` |
| Newsletter | `GET /api/newsletter/stats` | JWT | Subscription stats |
| Newsletter | `GET /api/newsletter/subscribers` | JWT | Active subscribers list |
| Admin (REST) | `POST /api/admin/login` | None | Admin login placeholder |
| Admin (REST) | `GET /api/admin/verify` | Admin JWT | Verifies admin session |

## Example requests

### PowerShell (Invoke-RestMethod)
```powershell
# Register
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/register" -ContentType 'application/json' -Body (@{name='Test User'; email='test@example.com'; password='Pass1234'} | ConvertTo-Json)

# Login
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/login" -ContentType 'application/json' -Body (@{email='test@example.com'; password='Pass1234'} | ConvertTo-Json)
$token = $login.token

# Load products
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/api/products"

# Add to cart
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/cart/add" -Headers @{Authorization="Bearer $token"} -ContentType 'application/json' -Body (@{product_id='<uuid>'; quantity=2} | ConvertTo-Json)

# Checkout (creates order and decrements stock)
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/orders" -Headers @{Authorization="Bearer $token"} -ContentType 'application/json' -Body (@{shipping_address='Beirut, Lebanon'} | ConvertTo-Json)
```

### curl
```bash
curl -X GET http://localhost:5000/api/products

curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shipping_address":"Beirut"}'
```

## Validation & error handling
- Input validation lives in `middleware/validation.js` and is applied per-route.
- JWT verification via `middleware/auth.js`; unauthorized requests return 401 with descriptive message.
- Global error handler in `server.js` standardizes JSON errors and includes stack traces in development.

## Swagger alternative
Swagger UI is not bundled to keep the runtime unchanged. Use this document plus the health endpoint (`GET /`) for live discovery. If Swagger is required, add `swagger-ui-express` and mount at `/api-docs` inside `laRama_backend/server.js` (no breaking changes needed).
