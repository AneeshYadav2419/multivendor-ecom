# Admin Panel — Complete Implementation Plan

## Background

Full analysis of the backend API at `server/src/` reveals **26 endpoints** across 7 route modules. The admin panel will be built using **only real, existing APIs** — no fake endpoints or dummy data.

---

## API Audit — Complete Endpoint Map

### Auth Module (`/api/auth`)
| Method | Route | Access | Admin Panel Use |
|--------|-------|--------|-----------------|
| POST | `/register` | Public | ❌ |
| POST | `/login` | Public | ✅ Login |
| POST | `/refresh` | Public | ✅ Token rotation |
| POST | `/logout` | Public | ✅ Logout |
| POST | `/logout-all` | Authenticated | ✅ |
| GET | `/me` | Authenticated | ✅ Profile data |

### Admin Module (`/api/admin`)
| Method | Route | Access | Admin Panel Use |
|--------|-------|--------|-----------------|
| GET | `/dashboard` | ADMIN | ✅ Dashboard stats |
| GET | `/pending` | ADMIN | ✅ Pending vendors list |
| PATCH | `/:id/approve` | ADMIN | ✅ Approve vendor |
| PATCH | `/:id/reject` | ADMIN | ✅ Reject vendor |
| PATCH | `/:id/suspend` | ADMIN | ✅ Suspend vendor |

### Admin Products Module (`/api/admin/products`)
| Method | Route | Access | Admin Panel Use |
|--------|-------|--------|-----------------|
| GET | `/pending` | ADMIN | ✅ Pending products list |
| PATCH | `/:id/approve` | ADMIN | ✅ Approve product |
| PATCH | `/:id/reject` | ADMIN | ✅ Reject product |

### Vendors Module (`/api/vendors`)
| Method | Route | Access | Admin Panel Use |
|--------|-------|--------|-----------------|
| GET | `/` | ADMIN | ✅ All vendors (with `?status=` filter) |
| PATCH | `/:vendorId/status` | ADMIN | ✅ Update vendor status |
| GET | `/me` | VENDOR | ❌ |
| PATCH | `/me` | VENDOR | ❌ |
| GET | `/dashboard` | VENDOR | ❌ |

### Products Module (`/api/products`)
| Method | Route | Access | Admin Panel Use |
|--------|-------|--------|-----------------|
| GET | `/` | Public | ✅ All products (paginated, filterable) |
| GET | `/:id` | Public | ✅ Product detail |

### Categories Module (`/api/categories`)
| Method | Route | Access | Admin Panel Use |
|--------|-------|--------|-----------------|
| GET | `/` | Public | ✅ All categories |
| GET | `/:id` | Public | ✅ Category detail |
| POST | `/` | ADMIN | ✅ Create category |
| PATCH | `/:id` | ADMIN | ✅ Update category |
| DELETE | `/:id` | ADMIN | ✅ Delete category |

### Orders Module (`/api/orders`)
| Method | Route | Access | Admin Panel Use |
|--------|-------|--------|-----------------|
| POST | `/` | CUSTOMER | ❌ |
| GET | `/my` | CUSTOMER | ❌ |
| GET | `/:id` | CUSTOMER | ❌ |

### Dashboard Stats Response Shape
```typescript
{
  totalUsers: number;
  totalVendors: number;
  activeVendors: number;
  pendingVendors: number;
  totalProducts: number;
  pendingProducts: number;
  activeProducts: number;
  totalOrders: number;
  completedOrders: number;
}
```

---

## API Gap Analysis — Missing Backend Endpoints

> [!WARNING]
> The following pages **cannot** be fully functional because no backend APIs exist for them. They will be created as **placeholder pages** with a clear "API Not Available" message — **not** fake functionality.

| Requested Feature | Status | Reason |
|-------------------|--------|--------|
| **Users Management** (list/edit/delete users) | ⚠️ Partial | No `GET /api/admin/users` endpoint. Dashboard stats include `totalUsers` count only. |
| **Orders Management** (list all orders) | ⚠️ Partial | No admin-level `GET /api/admin/orders` endpoint. Only customer-scoped order routes exist. Dashboard has `totalOrders` / `completedOrders` counts. |
| **Reviews Management** | ❌ No API | No review admin routes exist at all. |
| **Coupons Management** | ❌ No API | No coupon model or routes exist in schema or backend. |
| **Analytics** | ❌ No API | No analytics endpoints exist. Dashboard stats are the closest. |
| **Settings** | ❌ No API | No admin settings endpoint exists. |

---

## User Review Required

> [!IMPORTANT]
> **6 of the 10 requested pages have limited or no backend APIs.** The plan below creates real functional pages for the 4 fully-supported features (Dashboard, Vendors, Products, Categories), and creates clearly-labeled "Coming Soon / API Required" placeholder pages for the remaining 6. Should I proceed this way, or do you want me to **also build the missing backend API routes** before creating the admin panel?

---

## Open Questions

> [!IMPORTANT]
> 1. **Should I also create the missing backend endpoints** (admin users list, admin orders list, admin reviews CRUD) so those pages are fully functional? This would require modifications to the `server/` codebase.
> 2. **Charts library preference** — For the dashboard charts, should I install `recharts` (lightweight, React-native), or do you have a preferred charting library?
> 3. **The login page already exists at `/login`** — Should the admin login be the same page (with redirect logic based on role), or a separate `/admin/login` page?

---

## Proposed Changes

### Component: API Service Layer

#### [NEW] [admin.ts](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/lib/api/admin.ts)

Centralized admin API service with typed functions for all admin endpoints:

```typescript
// Admin Dashboard
getAdminDashboard()        → GET /api/admin/dashboard

// Vendor Management
getPendingVendors()        → GET /api/admin/pending
getAllVendors(status?)      → GET /api/vendors?status=
approveVendor(id)          → PATCH /api/admin/:id/approve
rejectVendor(id, reason?)  → PATCH /api/admin/:id/reject
suspendVendor(id)          → PATCH /api/admin/:id/suspend
updateVendorStatus(id, status) → PATCH /api/vendors/:id/status

// Product Management (Admin)
getPendingProducts()       → GET /api/admin/products/pending
approveProduct(id)         → PATCH /api/admin/products/:id/approve
rejectProduct(id)          → PATCH /api/admin/products/:id/reject

// Products (Public, used by admin for listing)
getAllProducts(params)     → GET /api/products
getProductById(id)        → GET /api/products/:id

// Categories (Full CRUD)
getAllCategories()         → GET /api/categories
getCategoryById(id)       → GET /api/categories/:id
createCategory(data)      → POST /api/categories
updateCategory(id, data)  → PATCH /api/categories/:id
deleteCategory(id)        → DELETE /api/categories/:id
```

---

### Component: TypeScript Types

#### [NEW] [types.ts](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/features/admin/types.ts)

All admin-specific TypeScript interfaces:
- `AdminDashboardStats` — mirrors the dashboard response
- `AdminVendor` — vendor with user relation
- `AdminProduct` — product with vendor + category
- `AdminCategory` — category with product count
- API response wrapper types

---

### Component: React Query Hooks

#### [NEW] [use-admin-dashboard.ts](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/features/admin/hooks/use-admin-dashboard.ts)
Hook wrapping `getAdminDashboard()` with React Query.

#### [NEW] [use-admin-vendors.ts](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/features/admin/hooks/use-admin-vendors.ts)
Hooks for vendor listing + mutations (approve/reject/suspend).

#### [NEW] [use-admin-products.ts](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/features/admin/hooks/use-admin-products.ts)
Hooks for all products listing + pending products + approve/reject mutations.

#### [NEW] [use-admin-categories.ts](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/features/admin/hooks/use-admin-categories.ts)
Hooks for category CRUD (list, create, update, delete).

---

### Component: Reusable Admin UI Components

All placed under `src/components/admin/`:

#### [NEW] [data-table.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/data-table.tsx)
Generic, reusable data table component with:
- Column definitions (header, accessor, render)
- Sorting (client-side)
- Loading skeleton state
- Empty state
- Row click handler

#### [NEW] [pagination.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/pagination.tsx)
Reusable pagination with page numbers, prev/next, page size selector.

#### [NEW] [search-input.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/search-input.tsx)
Debounced search input with search icon and clear button.

#### [NEW] [status-badge.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/status-badge.tsx)
Color-coded badge for vendor statuses (PENDING=amber, APPROVED=emerald, REJECTED=red, SUSPENDED=slate) and product statuses (DRAFT=amber, ACTIVE=emerald, OUT_OF_STOCK=red, ARCHIVED=slate).

#### [NEW] [stat-card.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/stat-card.tsx)
Dashboard statistics card with icon, label, value, and optional trend indicator. Glassmorphism design.

#### [NEW] [modal.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/modal.tsx)
Reusable modal with backdrop blur, close button, and slot-based content. Used for confirmation dialogs and forms.

#### [NEW] [confirm-dialog.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/confirm-dialog.tsx)
Confirmation dialog built on top of modal (for delete/approve/reject actions).

#### [NEW] [empty-state.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/empty-state.tsx)
Empty state component with icon, title, description, and optional CTA.

#### [NEW] [page-header.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/page-header.tsx)
Page header with title, description, and action buttons slot.

#### [NEW] [api-not-available.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/components/admin/api-not-available.tsx)
"API Not Available" placeholder card for pages without backend support. Lists which endpoints are needed.

---

### Component: Admin Layout

#### [NEW] [layout.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/layout.tsx)

Full admin layout (modeled after the existing vendor layout pattern in `(vendor)/layout.tsx`) with:
- **Collapsible Sidebar** with navigation items:
  - Dashboard, Vendors, Products, Categories, Orders, Users, Reviews, Coupons, Analytics, Settings
  - Active state highlighting
  - Collapse/expand with tooltips on collapsed state
- **Top Header** with:
  - Breadcrumbs (Admin / Page Title)
  - Mobile hamburger menu
  - Notification bell (visual only — no notification API)
  - Profile dropdown (name, email, role badge, logout)
- **Authentication guard** — redirects non-ADMIN users to `/login`
- **Responsive design** — mobile drawer + desktop collapsible sidebar
- Dark theme matching existing Aura design system (`#020617` background, indigo accents)

---

### Component: Admin Pages

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/dashboard/page.tsx)
**Dashboard page** — fully functional with real API:
- StatCards: Total Users, Total Vendors, Active Vendors, Pending Vendors, Total Products, Pending Products, Active Products, Total Orders, Completed Orders
- Visual grid layout with glassmorphism cards
- Loading skeletons during fetch
- Error handling with retry

---

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/vendors/page.tsx)
**Vendors Management** — fully functional:
- **Tabs**: All Vendors | Pending | Approved | Rejected | Suspended
- Data table with columns: Store Name, Owner, Email, Status, Date, Actions
- Filter by status via `GET /api/vendors?status=`
- Actions: Approve, Reject (with reason modal), Suspend
- Client-side search over fetched vendor data
- Loading/empty/error states

---

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/products/page.tsx)
**Products Management** — fully functional:
- **Tabs**: All Products | Pending Approval
- All Products tab: paginated list via `GET /api/products` with search, category filter, price sort
- Pending tab: list via `GET /api/admin/products/pending`
- Actions on pending: Approve / Reject
- Pagination from API response
- Columns: Image, Name, Price, Stock, Category, Vendor, Status, Actions

---

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/categories/page.tsx)
**Categories Management** — fully functional with full CRUD:
- List all categories with DataTable
- Create category modal (name + description form)
- Edit category modal (pre-filled)
- Delete with confirmation dialog
- Client-side search
- Columns: Name, Slug, Description, Date, Actions

---

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/orders/page.tsx)
**Orders page** — placeholder with dashboard stats:
- Shows Total Orders and Completed Orders from dashboard stats
- Displays "API Not Available" component explaining admin order listing requires a new `GET /api/admin/orders` endpoint
- Lists the exact backend routes needed

---

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/users/page.tsx)
**Users page** — placeholder with dashboard stats:
- Shows Total Users from dashboard stats
- "API Not Available" component explaining admin user management requires new backend endpoints

---

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/reviews/page.tsx)
**Reviews page** — "API Not Available" placeholder

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/coupons/page.tsx)
**Coupons page** — "API Not Available" placeholder

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/analytics/page.tsx)
**Analytics page** — "API Not Available" placeholder

#### [NEW] [page.tsx](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/app/(admin)/admin/settings/page.tsx)
**Settings page** — "API Not Available" placeholder

---

### Component: Login Redirect Enhancement

#### [MODIFY] [use-auth-mutations.ts](file:///c:/Users/anees/Desktop/multivendor-ecommerce/client/src/features/auth/hooks/use-auth-mutations.ts)

Add ADMIN role detection to the login mutation's `onSuccess` handler:
- If `user.role === "ADMIN"` → `router.push("/admin/dashboard")`
- If `user.role === "VENDOR"` → existing vendor redirect
- Default → customer redirect

---

## Complete File Tree (New Files)

```
client/src/
├── lib/api/
│   └── admin.ts                          ← API service layer
├── features/admin/
│   ├── types.ts                          ← TypeScript types
│   └── hooks/
│       ├── use-admin-dashboard.ts
│       ├── use-admin-vendors.ts
│       ├── use-admin-products.ts
│       └── use-admin-categories.ts
├── components/admin/
│   ├── data-table.tsx
│   ├── pagination.tsx
│   ├── search-input.tsx
│   ├── status-badge.tsx
│   ├── stat-card.tsx
│   ├── modal.tsx
│   ├── confirm-dialog.tsx
│   ├── empty-state.tsx
│   ├── page-header.tsx
│   └── api-not-available.tsx
└── app/(admin)/
    ├── layout.tsx                        ← Admin shell layout
    └── admin/
        ├── dashboard/page.tsx
        ├── vendors/page.tsx
        ├── products/page.tsx
        ├── categories/page.tsx
        ├── orders/page.tsx
        ├── users/page.tsx
        ├── reviews/page.tsx
        ├── coupons/page.tsx
        ├── analytics/page.tsx
        └── settings/page.tsx
```

---

## Verification Plan

### Automated Tests
```bash
cd client && npm run build
```
Ensures all TypeScript compiles, no broken imports, and Next.js pages build correctly.

### Manual Verification
1. Login as ADMIN → verify redirect to `/admin/dashboard`
2. Dashboard loads real stats from `GET /api/admin/dashboard`
3. Vendors page → fetch, filter by status, approve/reject/suspend
4. Products page → list all, list pending, approve/reject
5. Categories page → create, edit, delete category
6. Placeholder pages show clear "API Not Available" messages
7. Responsive: test sidebar collapse, mobile drawer
8. Auth guard: non-admin users redirected away
