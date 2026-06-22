<div align="center">

# 🛒 MultiVendor E-Commerce Platform

### A production-ready, full-stack multivendor marketplace built with modern technologies

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

<br/>

**[🚀 Live Demo](https://multivendor-ecom-84rl.vercel.app)** · **[📦 Backend API](https://multivendor-ecom-xlmh.onrender.com)** · **[🐛 Report Bug](https://github.com/AneeshYadav2419/multivendor-ecom/issues)**

<br/>

                                              **Home Page**

<img width="1918" height="912" alt="Image" src="https://github.com/user-attachments/assets/9a02173d-4894-43c6-bcf8-43264c903988" />


                                              **Product Listing**

<img width="1918" height="906" alt="Image" src="https://github.com/user-attachments/assets/956e47a8-d634-409f-8c7c-ce4f8c26cc40" />

                                            **Cart Page & Checkout Page**

<img width="1918" height="911" alt="Image" src="https://github.com/user-attachments/assets/72f5b590-cc97-4a92-b817-4eead313a9e1" />

                                             **Shipping Address Page**

<img width="1907" height="900" alt="Image" src="https://github.com/user-attachments/assets/60381b24-2669-4cb5-b737-601414fd68ff" />

                                                **Vendor Dashboard**

<img width="1918" height="911" alt="Image" src="https://github.com/user-attachments/assets/b7762dfc-f54a-4d00-a78b-13e48bf0e54c" />

                                                **Admin Dashboard**

<img width="1918" height="915" alt="Image" src="https://github.com/user-attachments/assets/f3046cfd-5661-430f-b7b9-adf99ca52e19" />****

</div>

---

## 📌 Overview

A **complete multivendor marketplace** where customers can shop, vendors can manage their stores, and admins control the entire platform — all under one roof.

This project demonstrates **enterprise-level architecture** with clean separation of concerns, secure JWT authentication with token rotation, role-based access control, and a scalable layered backend.

---

## ✨ Key Features

### 👤 Customer
- Register, Login & secure session management
- Browse & search products across all vendors
- Add to cart, update quantities, remove items
- Checkout & place orders
- View complete order history & details

### 🏪 Vendor
- Dedicated vendor dashboard
- Full product lifecycle — Create, Update, Delete
- Inventory & stock management
- View and update order status for their products

### 🔐 Admin
- Platform-wide analytics dashboard
- User & vendor management
- Category & product monitoring
- Complete order oversight

### 🔒 Security
- JWT Access + Refresh Token rotation
- HttpOnly secure cookies
- Role-Based Access Control (RBAC)
- Bcrypt password hashing
- Zod input validation
- Centralized error handling

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI, Framer Motion |
| **State Management** | Zustand, React Query |
| **Backend** | Node.js, Express.js, TypeScript |
| **ORM** | Prisma ORM |
| **Database** | PostgreSQL (Neon) |
| **Authentication** | JWT Access + Refresh Tokens, HttpOnly Cookies |
| **Payments** | Razorpay |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

---

## 🏗️ Architecture

The backend follows a **scalable layered architecture** for clean separation of concerns:

```
Client Request
      ↓
  Controller       ← Handles HTTP req/res
      ↓
   Service         ← Business logic
      ↓
  Repository       ← Database queries
      ↓
  Prisma ORM       ← Type-safe DB access
      ↓
  PostgreSQL        ← Persistent storage
```

**Benefits:** Testability · Maintainability · Scalability · Clean Business Logic

---

## 📁 Project Structure

```
multivendor-ecom/
│
├── client/                          # Next.js Frontend
│   └── src/
│       ├── app/                     # App Router pages
│       ├── components/              # Reusable UI components
│       ├── features/                # Feature-based modules
│       ├── hooks/                   # Custom React hooks
│       ├── store/                   # Zustand state stores
│       ├── lib/                     # Axios, utilities
│       └── types/                   # TypeScript types
│
└── server/                          # Express Backend
    ├── src/
    │   ├── config/                  # App configuration
    │   ├── common/
    │   │   ├── middlewares/         # Auth, error handlers
    │   │   └── utils/               # Helper functions
    │   └── modules/
    │       ├── auth/                # Authentication
    │       ├── users/               # User management
    │       ├── vendors/             # Vendor operations
    │       ├── categories/          # Product categories
    │       ├── products/            # Product management
    │       ├── cart/                # Cart operations
    │       ├── orders/              # Order processing
    │       └── admin/               # Admin controls
    └── prisma/
        ├── schema.prisma            # Database schema
        └── seed.ts                  # Seed data
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/AneeshYadav2419/multivendor-ecom.git
cd multivendor-ecom
```

### 2. Backend Setup

```bash
cd server
npm install

# Setup environment variables
cp .env.example .env
# Fill in your values (see Environment Variables section)

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Seed initial data (optional)
npx prisma db seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install

# Setup environment variables
cp .env.example .env.local
# Add: NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (Vendor) |
| PATCH | `/api/products/:id` | Update product (Vendor) |
| DELETE | `/api/products/:id` | Delete product (Vendor) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | Get my orders |
| GET | `/api/orders/:id` | Get order details |
| GET | `/api/vendors/orders` | Vendor orders |
| PATCH | `/api/vendors/orders/:id/status` | Update order status |

---

## 🗄️ Database Schema

```
User ──────────── Vendor ──────────── Product
  │                                      │
  │                                   CartItem
  │                                      │
  └──── Order ──── OrderItem ────────────┘
```

Key entities: `User · Vendor · Category · Product · Cart · CartItem · Order · OrderItem`

---

## 🔮 Roadmap

- [x] JWT Authentication with token rotation
- [x] Multi-role system (Admin / Vendor / Customer)
- [x] Product & inventory management
- [x] Cart & order management
- [x] Razorpay payment gateway
- [ ] ☁️ Cloudinary image uploads
- [ ] 📧 Email notifications (order confirmation, vendor alerts)
- [ ] ⭐ Product reviews & ratings
- [ ] 📦 Real-time order tracking
- [ ] 🔍 Advanced search & filters
- [ ] 💰 Returns & refund management
- [ ] 📊 Revenue analytics for vendors
- [ ] 🚚 Shipment tracking integration

---

## ⚡ Performance Optimizations

- React Query caching for reduced API calls
- Optimized Prisma queries with selective field fetching
- Database indexing on frequently queried fields
- Lazy loading for heavy components
- Next.js static page generation where applicable

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Aneesh Yadav](https://github.com/AneeshYadav2419)**

*Full Stack Developer · Node.js · Express.js · TypeScript · Prisma · PostgreSQL · React · Next.js · Tailwind CSS*

⭐ **Star this repo if you found it helpful!** ⭐

</div>
