# AuraMarket — Architecture & Build Guides

Read these in order:

| # | Document | Purpose |
|---|----------|---------|
| 1 | [ARCHITECTURE.md](./ARCHITECTURE.md) | Target enterprise structure (backend + frontend) |
| 2 | [AUTH-IMPLEMENTATION-ORDER.md](./AUTH-IMPLEMENTATION-ORDER.md) | Step-by-step auth files to read & implement |
| 3 | [MIGRATION-PLAYBOOK.md](./MIGRATION-PLAYBOOK.md) | How to migrate flat domains → `modules/` |

**Your status today**

- Auth module: enterprise vertical slice (done)
- Products module: enterprise vertical slice (done)
- Other domains: classic layered folders (migrate next: cart → orders)
- Client: `features/auth` + `features/products` (expand cart, orders next)
