# Task ID: 6 — Admin Dashboard Builder (Z.ai Code main agent)

## Task
Build a comprehensive admin dashboard (لوحة التحكم) for the Arabic beauty e-commerce store (جلورية), accessible via `?view=admin`, with 5 sections (dashboard, products, categories, orders, reviews), full CRUD, order timeline management, and review moderation — all in Arabic RTL with rose/gold theme.

## Approach
1. Read worklog.md to understand existing schema (Category, Product, Order, OrderItem, Review), existing API routes, page.tsx view router, theme, and components.
2. Built new admin API routes with zod validation:
   - `src/app/api/admin/stats/route.ts` — aggregate dashboard stats (totals, revenue, orders by status, 7-day revenue series, recent orders, top products, low stock list).
   - Added `POST` to `src/app/api/products/route.ts`.
   - Added `PUT` + `DELETE` to `src/app/api/products/[id]/route.ts` (DELETE blocks if order items exist).
   - Added `POST` to `src/app/api/categories/route.ts` (auto-unique slug from nameEn).
   - NEW `src/app/api/categories/[id]/route.ts` — GET, PUT, DELETE (blocks delete if products exist with Arabic message).
   - Enhanced `src/app/api/reviews/route.ts` GET — when no `productId`, returns ALL reviews with product join (limit 200). Backward compatible.
   - NEW `src/app/api/reviews/[id]/route.ts` — DELETE (recomputes product rating + reviewCount) and PUT (toggle verified / set helpful).
3. Modified `src/app/page.tsx` so when `view === "admin"`, it renders ONLY `<AdminView />` (no public Header/Footer/CartDrawer). Added "admin" to KNOWN_VIEWS.
4. Built `AdminView.tsx` — full-screen `h-screen` RTL layout:
   - Dark slate→rose gradient right sidebar (260px) with brand, nav (5 sections + "العودة للمتجر"), active rose accent bar (motion layoutId), admin user card.
   - Topbar with section title/subtitle, quick search, notifications bell, "إضافة منتج" quick button.
   - AnimatePresence page transitions on tab change.
   - Mobile: sidebar collapses into Sheet (hamburger).
   - Tab switching via `?view=admin&tab=...` (shareable URLs).
5. Built `AdminDashboard.tsx` — KPIs (4 cards: products, orders, revenue, avg rating), recharts BarChart for 7-day revenue (rose bars), orders-by-status list with colored dots, recent orders table, top products list (crown), low stock alert card with grid.
6. Built `AdminProducts.tsx` + `ProductForm.tsx` — toolbar (search + category filter), table (image, name, category, price, stock badge, flags badges, rating), pagination, ProductForm Dialog with all fields (basic info, pricing, images with preview, details, flags switches), AlertDialog confirm for delete.
7. Built `AdminCategories.tsx` + `CategoryForm.tsx` — grid of category cards with image, name (AR+EN), product count badge, slug, edit/delete. Form dialog with name, nameEn, description, image+preview, icon. Delete blocked by API if has products (shows error toast).
8. Built `AdminOrders.tsx` — toolbar (search + status filter), table (order #, customer, items, total, payment, status, date), order detail Sheet (slides from left for RTL) with: status management card (Select + advance timeline button), full timeline with checkmarks, customer info, payment info, items list, totals breakdown. PATCH calls for status + advanceTimeline.
9. Built `AdminReviews.tsx` — toolbar (search + rating filter + verified filter), table (product thumbnail+name, author, star rating, title+body, verified toggle button, helpful count, delete). Toggle verified via PUT. Delete via DELETE with AlertDialog confirm. Fetches all reviews via enhanced `/api/reviews` endpoint.

## Files created/modified
- **NEW** `src/app/api/admin/stats/route.ts`
- **MOD** `src/app/api/products/route.ts` (added POST + zod)
- **MOD** `src/app/api/products/[id]/route.ts` (added PUT + DELETE)
- **MOD** `src/app/api/categories/route.ts` (added POST + zod + slugify)
- **NEW** `src/app/api/categories/[id]/route.ts`
- **MOD** `src/app/api/reviews/route.ts` (GET-all when no productId)
- **NEW** `src/app/api/reviews/[id]/route.ts`
- **MOD** `src/app/page.tsx` (admin renders alone)
- **NEW** `src/components/views/AdminView.tsx`
- **NEW** `src/components/admin/AdminDashboard.tsx`
- **NEW** `src/components/admin/AdminProducts.tsx`
- **NEW** `src/components/admin/AdminCategories.tsx`
- **NEW** `src/components/admin/AdminOrders.tsx`
- **NEW** `src/components/admin/AdminReviews.tsx`
- **NEW** `src/components/admin/ProductForm.tsx`
- **NEW** `src/components/admin/CategoryForm.tsx`

## Verification
- `bun run lint` → ✅ passes cleanly (0 errors, 0 warnings). Auto-fixed unused eslint-disable directives.
- `GET /?view=admin` → 200, `GET /?view=admin&tab=dashboard|products|categories|orders|reviews` → all 200.
- `GET /api/admin/stats` → 200 with full stats payload (totalProducts=32, totalRevenue, ordersByStatus, revenueByDay, recentOrders, topProducts, lowStockList).
- `POST /api/products` → 201 created (verified end-to-end).
- `PUT /api/products/[id]` → 200 updated.
- `DELETE /api/products/[id]` → 200 deleted.
- `POST /api/categories` → 201 created (auto slug).
- `GET/PUT/DELETE /api/categories/[id]` → all work; DELETE returns 400 with Arabic message when category has products.
- `GET /api/reviews` (no productId) → 200 returns all 200 reviews with product join.
- `GET /api/reviews?productId=X` → 200 still returns bare array (backward compatible).
- `POST /api/reviews` → 201 created (recomputes product rating).
- `PUT /api/reviews/[id]` (toggle verified) → 200.
- `DELETE /api/reviews/[id]` → 200 (recomputes product rating + reviewCount).
- `PATCH /api/orders?id=X` with `advanceTimeline:true` → 200, advances to next step (ordered → processing → shipped → out_for_delivery → delivered).
- Storefront views (home, shop, product) still return 200 — no regressions.
- dev.log clean — only successful requests, no runtime errors.

## Stage Summary
A complete, professional **admin dashboard (لوحة التحكم)** is now live at `?view=admin` for the جلورية beauty store. It runs as a separate full-screen app (no public chrome), with a dark slate→rose gradient sidebar, RTL Arabic layout, and 5 fully-functional sections: dashboard with KPIs + recharts revenue chart + low stock alerts + top products; product CRUD with rich form dialog (all fields, switches, image preview); category CRUD with grid cards + delete guard; order management with detail Sheet showing timeline + status advance + totals breakdown; review moderation with star display + verified toggle + delete with auto-rating-recompute. All API routes use zod validation, proper status codes, `force-dynamic`, and return bare arrays for list endpoints (consistent with existing patterns). The rose/gold theme is preserved throughout, Tajawal Arabic font, sonner toasts for all actions, loading skeletons, empty states, and mobile-responsive (sidebar collapses to Sheet). Lint passes cleanly with zero errors/warnings and the dev server reports no runtime errors.
