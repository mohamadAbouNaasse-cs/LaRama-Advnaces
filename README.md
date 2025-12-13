# LaRama Advances Monorepo

Handmade beadwork e-commerce platform built for **UOB CSIS279: Advances in Computer Science**. The monorepo contains:

- **laRama_backend** – Express REST API for customers (port **5000**)
- **laRama_backend_nest** – NestJS GraphQL admin API (port **4001**, `/graphql` with `x-admin-key` header)
- **laRama_frontend** – React + Vite storefront/admin UI (port **5173**)

The stack demonstrates modular backends, PostgreSQL data modeling, and a component-driven frontend with Redux and GraphQL coverage.

## Table of Contents
- [Architecture overview](#architecture-overview)
- [Tech stack & versions](#tech-stack--versions)
- [Project structure](#project-structure)
- [Environment setup](#environment-setup)
- [Install & run (PowerShell-ready)](#install--run-powershell-ready)
- [API documentation](#api-documentation)
- [Database schema](#database-schema)
- [Redux + GraphQL evidence](#redux--graphql-evidence)
- [Testing & verification checklist](#testing--verification-checklist)
- [Troubleshooting](#troubleshooting)
- [Method-level documentation](#method-level-documentation)

## Architecture overview
```
+----------------+        +------------------------+        +-----------------------+
| React + Vite   | <----> | Express REST API       | <----> | PostgreSQL (uuid-ossp)|
| (5173)         |        | Customer endpoints 5000|        | Orders, products, etc.|
+----------------+        +------------------------+        +-----------------------+
        ^                           ^
        |                           |
        |                           v
        |                  +------------------------+
        |                  | NestJS GraphQL Admin   |
        |                  | /graphql, port 4001    |
        |                  | Protected by x-admin-key|
        |                  +------------------------+
```
- **Customer flow**: React app calls Express REST for auth, products, cart, orders, newsletter. WhatsApp checkout message is generated from cart/order data.
- **Admin flow**: React admin pages use Apollo Client + Redux to manage products over GraphQL (`/graphql`) with `x-admin-key`.

## Tech stack & versions
**Frontend (laRama_frontend)**
- React **18.2.0**, React Router DOM **7.8.2**, Vite **7.1.2**, Tailwind **4.1.12**
- Redux Toolkit **1.9.7**, React Redux **8.1.3**
- Apollo Client **3.8.0**, GraphQL **16.7.1**

**Customer REST backend (laRama_backend)**
- Node.js (>=16), Express **5.1.0**, Socket.IO **4.7.5**, PostgreSQL via `pg` **8.16.3**
- JWT auth (`jsonwebtoken` **9.0.2**), bcryptjs **3.0.3**, dotenv **17.2.3**, cors **2.8.5**

**Admin GraphQL backend (laRama_backend_nest)**
- NestJS **10.x**, Apollo GraphQL **12.0.7**, TypeORM **0.3.18**, class-validator **0.14.0**

## Project structure
```
LaRama-Advnaces/
├─ README.md
├─ docs/                      # API & technical notes (created in this update)
├─ laRama_backend/            # Express REST API (port 5000)
│  ├─ server.js
│  ├─ routes/ (auth, products, cart, orders, newsletter, admin)
│  ├─ controllers/            # Business logic & validation
│  ├─ config/database.js      # PostgreSQL pool & health check
│  ├─ database.sql            # Schema + seed data
│  └─ scripts/                # Optional DB helpers (migrate/seed)
├─ laRama_backend_nest/       # NestJS GraphQL API (port 4001)
│  ├─ src/app.module.ts
│  ├─ src/product/*           # Entity, resolver, service, guard
│  └─ src/utils/db.utils.ts   # TypeORM config
└─ laRama_frontend/           # React + Vite frontend (port 5173)
   ├─ src/api/graphql/*       # Apollo client + queries
   ├─ src/store/*             # Redux store + product slice
   ├─ src/pages/, components/ # Storefront and admin UI
   └─ vite.config.js
```

## Environment setup
Create three `.env` files using these templates (PowerShell-friendly here-docs work in most shells).

**laRama_backend/.env**
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=LaRama_db_advances
DB_USER=postgres
DB_PASSWORD=your_db_password
JWT_SECRET=super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

**laRama_backend_nest/.env**
```
PORT=4001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=LaRama_db_advances
DB_USER=postgres
DB_PASSWORD=your_db_password
ADMIN_KEY=your_admin_header_value
```

**laRama_frontend/.env**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_GRAPHQL_URL=http://localhost:4001/graphql
VITE_ADMIN_KEY=your_admin_header_value
VITE_WHATSAPP_NUMBER=whatsapp_number_with_country_code
```

## Install & run (PowerShell-ready)
Run services in three terminals after PostgreSQL is running and `database.sql` has been executed.

1) **Database**
- Create DB `LaRama_db_advances` in PostgreSQL and run `laRama_backend/database.sql` (pgAdmin or `psql -f database.sql`).

2) **Express REST API (port 5000)**
```powershell
cd laRama_backend
npm install
npm run dev   # nodemon, or `npm start` for production
```

3) **NestJS GraphQL Admin API (port 4001, /graphql)**
```powershell
cd laRama_backend_nest
npm install
npm run build
npm start        # runs dist/main.js
# or during development
npm run start:dev
```

4) **React + Vite Frontend (port 5173)**
```powershell
cd laRama_frontend
npm install --legacy-peer-deps   # resolves peer-dependency warnings in this Vite/React combo
npm run dev
```

**Port summary**
| Service | Port | Notes |
| --- | --- | --- |
| React Vite | 5173 | Uses Vite dev server (`npm run dev`) |
| Express REST | 5000 | Health check at `/` |
| NestJS GraphQL | 4001 | Endpoint `/graphql`, requires `x-admin-key` |

## API documentation
Detailed REST and GraphQL references live in `docs/`:
- [`docs/API_REST.md`](docs/API_REST.md) – endpoints, auth headers, sample `curl`/PowerShell `Invoke-RestMethod` calls.
- [`docs/API_GRAPHQL.md`](docs/API_GRAPHQL.md) – schema overview, admin header usage, sample queries/mutations.

**Swagger note**: A Swagger UI is not bundled. The REST endpoints are fully documented in `docs/API_REST.md` with ready-to-run examples (acts as the Swagger alternative). Add Swagger later by mounting `swagger-ui-express` under `/api-docs` if desired.

### Quick REST outline (customer API)
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`, `GET /api/auth/verify-token`
- `GET /api/products`, `/categories`, `/featured`, `/:id`
- `GET /api/cart`, `POST /api/cart/add`, `PUT /api/cart/items/:cart_item_id`, `DELETE /api/cart/items/:cart_item_id`, `DELETE /api/cart/clear`
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:order_id`, `GET /api/orders/stats`
- `POST /api/newsletter/subscribe`, `POST /api/newsletter/unsubscribe`, `GET /api/newsletter/stats`, `GET /api/newsletter/subscribers`
- `POST /api/admin/login`, `GET /api/admin/verify`

### Quick GraphQL outline (admin API)
- Endpoint: `http://localhost:4001/graphql`
- Required header: `x-admin-key: <ADMIN_KEY>`
- Queries: `products`, `product(id)`
- Mutations: `createProduct(input)`, `updateProduct(input)`, `removeProduct(id)`

## Database schema
PostgreSQL schema defined in `laRama_backend/database.sql`:
- **users** (UUID PK, name, email unique, password hash, timestamps)
- **products** (UUID PK, name, description, price, `image_url`, category, `stock_quantity`, `is_active`)
- **carts** (UUID PK, `user_id` unique) and **cart_items** (UUID PK, `cart_id`, `product_id`, quantity)
- **orders** (UUID PK, `user_id`, `total_amount`, `status`, `shipping_address`) with **order_items** (UUID PK, `order_id`, `product_id`, quantity, price snapshot)
- **newsletter_subscriptions** (UUID PK, email unique, status)
- Triggers keep `updated_at` fresh; stock decrements on order creation are handled in `orderController.js`.

## Redux + GraphQL evidence
- **Redux**: `src/store/products/productsSlice.js` manages product list state with async thunks for load/add/edit/delete.
- **GraphQL**: `src/api/graphql/products.API.js` + `products.queries.js` use Apollo Client against the NestJS `/graphql` endpoint (protected by `x-admin-key`). Admin UI pages consume these hooks for product CRUD.
- Coverage satisfies the course requirement of ~25% Redux and ~25% GraphQL usage within the frontend.

## Testing & verification checklist
- React dev server reachable at `http://localhost:5173`.
- REST health check: `GET http://localhost:5000/` returns JSON status.
- Products: `GET http://localhost:5000/api/products` returns catalog data.
- GraphQL: `POST http://localhost:4001/graphql` with `x-admin-key` and `{ products { id name price } }` succeeds.
- Admin product mutations (create/update/delete) succeed via GraphQL and reflect in Redux state.
- Cart to order flow: add items, create order via REST, confirm stock decreases and WhatsApp checkout message is generated from cart/order summary.

## Troubleshooting
- **Peer dependency warnings**: use `npm install --legacy-peer-deps` inside `laRama_frontend`.
- **Port already in use**: `netstat -ano | findstr :5000` (PowerShell) then `taskkill /PID <pid> /F`.
- **Remove node_modules on Windows**: `Remove-Item -Recurse -Force node_modules`.
- **GraphQL unauthorized**: ensure `VITE_ADMIN_KEY` in frontend and `ADMIN_KEY` in Nest `.env` match; header must be `x-admin-key`.
- **CORS**: Express expects `FRONTEND_URL` (defaults to `http://localhost:3000`); set to `http://localhost:5173` in `.env` during local dev.

## Method-level documentation
- Backend JS controllers and middleware include rich JSDoc blocks (see `laRama_backend/controllers/*`).
- NestJS services/resolvers use TypeScript typings; generated schema lives at `laRama_backend_nest/src/schema.gql`.
- For deeper per-method notes, see the module-specific markdown files in `docs/`.
