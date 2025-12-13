# laRama_backend_nest

Isolated NestJS skeleton for additional backend work for the LaRama project.

This folder is intentionally separate from `laRama_backend/` per project safety rules.

## Avoid port conflicts on 4001

Only **one** Nest process should run at a time. If you suspect a leftover process is blocking `4001`, use:

```powershell
netstat -ano | findstr :4001
taskkill /PID <PID> /F
```

## Stable single-run workflow (no respawn watchers)

```powershell
cd laRama_backend_nest
npm install
npm run build
npm start
```

The server binds to `http://127.0.0.1:4001` with CORS opened for Vite (`http://localhost:5173`).

Verify the port is listening (helpful on Windows):

```powershell
netstat -ano | findstr :4001
Test-NetConnection -ComputerName 127.0.0.1 -Port 4001
```

Run the admin GraphQL query from PowerShell (honors `ADMIN_KEY` from `.env`):

```powershell
$body = @{ query = "query { products { id name price description } }" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:4001/graphql" -Method Post -ContentType "application/json" -Headers @{ "x-admin-key"=$env:ADMIN_KEY } -Body $body
```

## Full project bring-up (all three folders)

1. **Customer REST backend** (unchanged):
   ```powershell
   cd laRama_backend
   npm install
   npm run start
   ```
2. **Admin GraphQL backend (this folder)** using the commands above (`npm run build` ➜ `npm start`). Change `PORT` in `.env` only if 4001 must be freed; keep frontend env aligned if you change it.
3. **Frontend (Vite + Redux admin UI + customer pages)**:
   ```powershell
   cd laRama_frontend
   npm install
   npm run dev
   ```
   Visit the admin area at `/admin` and ensure `VITE_ADMIN_KEY` matches the Nest `ADMIN_KEY`.

Suggestions: if you frequently hit port conflicts on 4001, stop lingering Node processes with the `taskkill` command above or temporarily set another `PORT` in `.env` (remember to update the frontend admin client to the same port).
