# laRama_backend_nest

Isolated NestJS skeleton for additional backend work for the LaRama project.

This folder is intentionally separate from `laRama_backend/` per project safety rules.

Usage (developer machine):

1. cd into this folder
2. run `npm install`
3. run `npm run start:dev`

Quick test checklist
1. Start the existing Express backend (no changes required) so the customer site continues working.
2. Start the Nest backend (development):

```powershell
cd laRama_backend_nest
npm install
npm run start:dev
```

This starts the Nest server using the `.env` `PORT` (defaults to `4001`). Open GraphQL Playground at `http://localhost:4001/graphql`.

3. In Playground run:
- `query { products { id name price description } }` to list products
- `mutation { createProduct(input: { name: "X", price: 9.99 }) { id name } }` to create

4. Start the frontend (`laRama_frontend`) as usual (Vite):

```powershell
cd laRama_frontend
npm install
npm run dev
```

5. Open the admin area (`/admin`) and go to the Products page. The page will use the admin GraphQL client and Redux thunks to load products and perform create/edit/delete (the admin key is read from `VITE_ADMIN_KEY` in `laRama_frontend/.env`).

Notes:
- The Express backend remains unchanged and should continue to serve the customer-facing site.
- The Nest backend is intentionally isolated in `laRama_backend_nest/` to avoid modifying the existing Express codebase.
- Ensure both `.env` files use the same `ADMIN_KEY` / `VITE_ADMIN_KEY` for admin operations.
