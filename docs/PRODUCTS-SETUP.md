# Products API — Setup & Testing

## 1. Seed demo data (required once)

```bash
cd server
npm run db:seed
```

Creates **8 products**, **3 categories**, and demo users.

**Demo password (all accounts):** `Demo@12345`

| Email | Role |
|-------|------|
| admin@auramarket.com | ADMIN |
| vendor@auramarket.com | VENDOR (approved) |
| customer@auramarket.com | CUSTOMER |

## 2. Run servers

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

## 3. Client env

Copy `client/.env.example` → `client/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 4. Test API

```bash
GET http://localhost:5000/api/products?limit=12&sortBy=newest
GET http://localhost:5000/api/products/:id
```

## 5. Browse UI

Open **http://localhost:3000/products**
