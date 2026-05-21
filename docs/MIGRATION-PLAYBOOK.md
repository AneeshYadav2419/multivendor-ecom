# Migration Playbook — Flat Layers → `modules/`

Use **auth** as the copy template. Migrate **one domain at a time** (start with `products`).

---

## Before / after

### Before (horizontal)

```
routes/productRoutes.ts
controllers/productController.ts
services/productService.ts
validations/productValidation.ts
```

### After (vertical slice)

```
modules/products/
  product.routes.ts
  product.controller.ts
  product.service.ts
  product.validation.ts
  product.dto.ts          ← add: export types from Zod
```

---

## Migration steps (products example)

### 1. Create folder

```
server/src/modules/products/
```

### 2. Move & rename files

| From | To |
|------|-----|
| `validations/productValidation.ts` | `modules/products/product.validation.ts` |
| `services/productService.ts` | `modules/products/product.service.ts` |
| `controllers/productController.ts` | `modules/products/product.controller.ts` |
| `routes/productRoutes.ts` | `modules/products/product.routes.ts` |

### 3. Fix imports in moved files

```typescript
// product.routes.ts
import * as productController from "./product.controller.js";
import { validate } from "../../middlewares/validateMiddleware.js";
import { protect, restrictTo, checkVendorApproval } from "../../middlewares/authMiddleware.js";
import { createProductSchema } from "./product.validation.js";
```

### 4. Add DTO file (new)

```typescript
// product.dto.ts
import { z } from "zod";
import { createProductSchema } from "./product.validation.js";

export type CreateProductDTO = z.infer<typeof createProductSchema>["body"];
```

### 5. Refactor controller to thin + catchAsync

**Before:** manual try/catch  
**After:**

```typescript
import { catchAsync } from "../../utils/catchAsync.js";

export const getAllProducts = catchAsync(async (req, res) => {
  const result = await productService.getAllProductsService(req.query);
  res.status(200).json({ success: true, data: result });
});
```

### 6. Update route registry

**File:** `server/src/routes/index.ts`

```typescript
import productRoutes from "../modules/products/product.routes.js";
// ...
app.use("/api/products", productRoutes);
```

### 7. Delete old files

Remove originals from `routes/`, `controllers/`, `services/`, `validations/` only after grep shows no imports.

### 8. Smoke test

- `GET /api/products`
- `POST /api/products` as approved vendor
- Confirm validation errors return 422

---

## Client mirror (products)

After backend module exists:

```
client/src/features/products/
  components/product-card.tsx
  components/product-grid.tsx
  hooks/use-products.ts          ← move from hooks/api/
  types/index.ts
client/src/lib/api/products.ts   ← new
client/src/app/(public)/products/page.tsx
```

---

## Do NOT migrate these until last

| Domain | Reason |
|--------|--------|
| `webhooks` | Raw body must mount before `express.json()` in `app.ts` |
| `payments` | Tightly coupled to webhooks + Razorpay |

Keep `app.use("/api/webhooks", webhookRoutes)` **above** body parsers even after migration.

---

## Definition of done (per domain)

- [ ] All routes live under `modules/<domain>/`
- [ ] Controllers use `catchAsync`
- [ ] Responses use `{ success, data }` shape
- [ ] No `any` in new DTOs
- [ ] Old flat files deleted
- [ ] Client `features/<domain>/` started
- [ ] Manual test checklist passed
