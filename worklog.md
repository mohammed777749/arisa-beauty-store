# Project Worklog — متجر التجميل الإلكتروني (Beauty E-commerce Store)

This file tracks all work done by agents on this project. Each agent MUST append a new section (starting with `---`) after completing its task.

Project: Professional beauty e-commerce store (Arabic RTL) — makeup, lips, hair, nails, perfumes, skincare.
Tech: Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma (SQLite), Zustand.
Theme: Rose/pink/gold elegant feminine design. RTL Arabic layout.

---

## Task ID: 4
**Agent name:** Beauty Store Builder (Z.ai Code)
**Task description:** Build a complete, production-ready Arabic beauty e-commerce store (متجر تجميل) — RTL layout, rose/pink/gold elegant feminine theme. 6 categories (مكياج، شفاه، شعر، أظافر، عطور، عناية بالبشرة), 24-30 products, cart with localStorage persistence, checkout flow that creates orders, all views functional via client-side URL search params.

### Work Log
- Replaced Prisma schema (`prisma/schema.prisma`) with `Category`, `Product`, `Order`, `OrderItem` models (SQLite-friendly, JSON-string arrays for `images`/`shades`). Ran `bun run db:push` to apply.
- Created `src/lib/seed-data.ts` with **6 categories** and **32 products** (real Arabic names, descriptions, prices in ر.س, shades for lip/nail products, ratings, review counts, isFeatured/isBestseller/isNew flags, discounts). Mapped every product to one of the available `prod-*.jpg` images and every category to its `cat-*.jpg`.
- Created `prisma/seed.ts` (runnable script) and `src/app/api/seed/route.ts` (idempotent GET endpoint that wipes + re-seeds). Ran the seed → DB now has 6 categories + 32 products.
- Built API routes:
  - `GET /api/categories` — returns categories with product counts.
  - `GET /api/products` — supports `?category`, `?featured`, `?bestseller`, `?new`, `?search`, `?sort=price-asc|price-desc|rating|newest`, `?limit`. Includes category relation.
  - `GET /api/products/[id]` — single product with category.
  - `POST /api/orders` — creates order + order items with zod validation, decrements product stock, returns created order.
  - `GET /api/orders` — lists all orders (used by order-success page).
  - `GET /api/seed` — re-seed the database.
- Created `src/store/cart.ts` Zustand store with `persist` middleware → localStorage. Actions: `addItem`, `removeItem`, `updateQuantity`, `setQuantity`, `clearCart`, `openCart`, `closeCart`, `toggleCart`, `getTotalItems`, `getTotalPrice`. Handles per-shade cart items.
- Updated `src/app/layout.tsx`: `<html lang="ar" dir="rtl">`, **Tajawal** Arabic font via `next/font/google`, Arabic metadata title "جلورية | متجر التجميل والمستحضرات الفاخرة", added Sonner toaster alongside the legacy shadcn Toaster.
- Rewrote `src/app/globals.css` with a **rose/pink/gold feminine theme** using oklch colors. Rose-600 primary (`oklch(0.62 0.21 13)`), gold accent (`oklch(0.78 0.15 85)`), soft-pink secondary, custom scrollbar, utility classes (`bg-primary-gradient`, `bg-gold-gradient`, `bg-rose-gradient`, `text-primary-gradient`, `shadow-rose`, `shadow-soft`, `bg-dots`).
- Built core components:
  - `Header.tsx` — sticky header with utility bar (free shipping notice, phone), logo (جلورية / GLAMOUR BEAUTY), desktop search bar, nav (الرئيسية، المكياج، الشفاه، الشعر، الأظافر، العطور، العناية), wishlist heart, cart icon with hydrated count badge, mobile hamburger Sheet menu. Active link highlight via `useSearchParams`.
  - `Footer.tsx` — `mt-auto` sticky-to-bottom, value-props row (شحن مجاني، ضمان الجودة، إرجاع سهل، دفع آمن), brand + newsletter signup (sonner toast), 3 link columns, social icons, payment badges, copyright.
  - `ProductCard.tsx` — square image, badges (خصم %، جديد، الأكثر مبيعاً), wishlist button, quick-view hover overlay, brand + star rating, name + description, price with oldPrice strikethrough, add-to-cart button (opens cart drawer + sonner toast). Clicking navigates to `?view=product&id=xxx`. Framer Motion fade-in.
  - `CategoryCard.tsx` — square image, gradient overlay, name + product count, "تسوقي الآن" hover CTA → `?view=shop&category=slug`.
  - `CartDrawer.tsx` — slide-in Sheet from **left** (RTL), rose-gradient header, item list with per-shade items, qty +/- controls, remove, subtotal, "عرض السلة" + "إتمام الشراء" buttons, empty state.
  - `HeroSection.tsx` — full-bleed hero with `hero.jpg`, dark gradient overlay, Arabic headline "جمالكِ يبدأ من هنا" with gradient text, subtext, dual CTAs (تسوقي الآن / العطور الفاخرة), stats (+٢٥٠ منتج، +٤٠ ألف عميلة، ٤.٩ تقييم), floating promo strip below.
  - `ProductGrid.tsx` — responsive 2/3/4 column grid with loading skeletons + empty state.
  - `Filters.tsx` — sidebar with search input, category list (with counts), sort select, clear-filters button. Updates URL params.
  - `StarRating.tsx` — filled/half/empty gold stars using lucide Star.
  - `QuantitySelector.tsx` — +/- pill with number input.
  - `SectionHeader.tsx` — eyebrow + title + subtitle + view-all button with motion.
- Built 6 view components in `src/components/views/`:
  - `HomeView.tsx` — Hero → 6 categories → featured products (rose-gradient section) → promo banner (خصم ٢٥٪ على العطور — code GLAM25) → bestsellers → new arrivals → brand values (شحن مجاني، ضمان الجودة، دفع آمن، إرجاع سهل) → testimonials.
  - `ShopView.tsx` — rose-gradient page hero with category name/desc, sidebar Filters + ProductGrid, reads `?category`, `?sort`, `?search`.
  - `ProductView.tsx` — breadcrumb, large image with discount badge, brand + star rating + reviews, price + oldPrice strikethrough + savings badge, description, shade selector (if shades), QuantitySelector with stock indicator, "أضيفي للسلة" + "اشتري الآن" + wishlist buttons, perks row, Tabs (الوصف، المكونات، التقييمات، الشحن والإرجاع), related products grid.
  - `CartView.tsx` — items list with qty controls + remove + per-shade display, "متفريغ السلة" button, sticky summary sidebar with promo code input (GLAM25 = 25% off, WELCOME10 = 10% off), subtotal/discount/shipping/total, free-shipping progress notice, "متابعة الدفع" button.
  - `CheckoutView.tsx` — 3-section form (معلومات التواصل، عنوان التوصيل، طريقة الدفع) with radio-group for payment (الدفع عند الاستلام، تحويل بنكي، بطاقة ائتمانية), sticky order summary with items, POST to `/api/orders` on submit, navigates to `?view=order-success&orderId=xxx` on success, sonner toasts for errors, empty-cart guard.
  - `OrderSuccessView.tsx` — success hero with check-circle animation, order number badge (#LAST8), fetches order details from `/api/orders`, displays customer info + items, 3-step timeline (تأكيد الطلب ✓، تجهيز، شحن), CTAs to continue shopping / home.
- Updated `src/app/page.tsx` to be a client component that reads `?view=` param and switches between the 6 views, all wrapped by Header + CartDrawer + Footer (sticky-to-bottom via `min-h-screen flex flex-col` + `flex-1` main + `mt-auto` footer). Wrapped in Suspense for `useSearchParams`. Scrolls to top on view change.
- Created shared `src/lib/types.ts` with `Category`, `Product`, `parseProduct()`, `formatPrice()`, `CURRENCY` ("ر.س") helpers.
- Fixed two ESLint errors: removed `setMounted` setState-in-effect pattern in Header (relied on Zustand `hasHydrated` instead), removed unused `scrolledToTop` state in page.tsx.
- Fixed `@/prisma/seed-data` module-not-found error by moving seed-data to `src/lib/seed-data.ts` (resolved alias `@/lib/seed-data`), updated both `prisma/seed.ts` and `src/app/api/seed/route.ts` imports.
- Fixed a stray `prod-makeup.jpg` reference (file doesn't exist) → swapped to `prod-foundation.jpg`, re-seeded.
- Cleaned up test orders created during verification.

### Verification
- `bun run lint` → ✅ passes with no errors/warnings.
- Database seeded: 6 categories, 32 products (11 featured, 11 bestsellers, 9 new).
- API endpoints verified via curl: `/api/categories`, `/api/products?featured=true|bestseller=true|new=true|category=|search=|sort=|limit=`, `/api/products/[id]`, `POST /api/orders` (created order, total = 250 ر.س, status = pending, stock decremented), `GET /api/orders`, `GET /api/seed`.
- All 5 view routes return HTTP 200: `/` (home), `/?view=shop`, `/?view=product&id=...`, `/?view=cart`, `/?view=checkout`.
- Arabic content renders correctly (جلورية، جمالكِ، تسوقي الآن، المكياج، الأكثر مبيعاً، عناية بالبشرة).
- `dev.log` shows no runtime errors — only Prisma query logs and successful `GET` requests.

### Stage Summary
A complete, polished, production-ready **Arabic beauty e-commerce store (جلورية)** is now live on `/` with RTL layout, Tajawal Arabic font, and an elegant rose/pink/gold feminine theme. The store has 6 product categories and 32 seeded products with real Arabic copy, prices in Saudi Riyal, discounts, shades, ratings, and review counts. All shopping flows work end-to-end: browse → product detail → add to cart (persisted to localStorage) → cart with promo codes → checkout form → order creation via API → order success page. The UI is fully responsive with a mobile menu, sticky header, sticky-to-bottom footer, and Framer Motion animations throughout. Lint passes cleanly and the dev server reports no errors.

---

## Task ID: 5
**Agent name:** Amazon-style Enhancement (Z.ai Code main agent)
**Task description:** Transform the existing beauty store into an Amazon-style full-featured shopping experience: enhanced browsing with advanced filters, product detail with gallery + reviews + bundles, cart with save-for-later, multi-step checkout with payment integration, order history, order tracking, wishlist, recently viewed.

### Work Log
- Enhanced Prisma schema: added `Review` model (productId, author, rating, title, body, helpful, verified, createdAt). Added fields to `Product` (isChoice, prime, ingredients, weight, origin) and `Order` (paymentMethod, paymentStatus, trackingNumber, estimatedDelivery, timeline, subtotal, shipping, discount, tax, promoCode). Ran `db:generate` + `db:push`.
- Updated `src/lib/seed-data.ts` with new product fields (ingredients, weight, origin, isChoice, prime) and added `generateReviews()` + `reviewCountForProduct()` helpers generating Arabic reviews (author names, titles, bodies, helpful counts, timestamps).
- Ran seed script (`prisma/seed.ts`) directly → seeded 6 categories, 32 products, **172 reviews** with real Arabic copy.
- New API routes: `GET/POST /api/reviews` (with zod validation, recompute product rating on insert), `GET /api/orders?id=X` (single order with items), `PATCH /api/orders?id=X` (advance timeline), enhanced `GET /api/products` (minPrice, maxPrice, rating, brand, prime, inStock, isChoice, page, limit, total count), enhanced `GET /api/products/[id]` (includes reviews), enhanced `POST /api/orders` (address object, paymentMethod, subtotal/shipping/discount/tax/totals, trackingNumber, estimatedDelivery, timeline, stock decrement).
- New Zustand stores: `wishlist.ts` (product IDs, toggle/remove), `recentlyViewed.ts` (max 10, most recent first), `addresses.ts` (saved addresses with default), `payments.ts` (saved cards, masked, no CVV).
- Amazon-style Header: location selector (التوصيل إلى الرياض), search bar with category dropdown (كل الأقسام + 6 categories), account dropdown (حسابي والقوائم), returns & orders (المرتجعات والطلبات), wishlist button, cart with badge, mega-nav (الكل, عروض اليوم, الأكثر مبيعاً, جديدنا, بطاقات الهدايا, تتبع طلبك, تواصلي معنا).
- Enhanced ShopView/SearchView: breadcrumb, left sidebar filters (department, customer reviews rating, price range + quick ranges, brand checkboxes, availability, shades), toolbar (results count, sort dropdown, view toggle), pagination.
- Enhanced ProductView: image gallery (main + thumbnails), breadcrumb, brand link, star rating + review count link, "اختيار جلورية" badge, price with savings, prime delivery badge, stock status, shade swatches, quantity selector, gold "أضيفي إلى السلة" + orange "اشتري الآن" + wishlist buttons, "اشترِ معاً ووفّري" (frequently bought together) bundle, "عملاء اشتروا هذا المنتج اشتروا أيضاً" carousel, rating histogram, review list with helpful votes, review form modal, recently viewed strip.
- Enhanced CartView: free shipping progress bar, items with save-for-later + delete, "حفظ لاحقاً" section, recommendations carousel, promo code input (GLAM25, WELCOME10).
- Multi-step CheckoutView: Step 1 (عنوان الشحن — saved addresses + new address form), Step 2 (طريقة الدفع — COD/bank transfer/credit card with card form), Step 3 (مراجعة الطلب — review + confirm), persistent order summary sidebar, Stepper indicator.
- New OrdersView: filter tabs (آخر ٣٠ يوماً، ٦ أشهر، ٢٠٢٤، ٢٠٢٣), search orders, order cards with status badges, "عرض تفاصيل", "تتبع الطرد", "اشترِ مرة أخرى".
- New OrderDetailView: order # badge, tracking timeline (تم الطلب→قيد التجهيز→تم الشحن→خرج للتوصيل→تم التوصيل), estimated delivery, tracking number, address card, payment method, order summary, "تنزيل الإيصال", "اشترِ مرة أخرى".
- New WishlistView: grid of wishlisted products with "أضيفي إلى السلة" + delete.
- New components: ProductGallery, ReviewHistogram, ReviewForm, ReviewItem, FrequentlyBoughtTogether, RelatedCarousel, RecentlyViewed, RatingFilter, ShopFilters, ShopToolbar, Pagination, LightningDeals (with countdown), AddressCard, AddressForm, CardForm, Stepper, OrderTimeline.
- New views wired into `page.tsx`: search, orders, order-detail, wishlist (in addition to existing home, shop, product, cart, checkout, order-success).

### Bug Fixes (by main agent after subagent timeout)
- Fixed duplicate `body` variable in `src/app/api/reviews/route.ts` POST handler (renamed to `payload`) — was causing 500 compile error "the name `body` is defined multiple times".
- Fixed `HomeView.tsx` — API now returns `{products:[...], total, page, ...}` instead of bare array; added `arr()` helper to extract `.products` for all 6 fetch calls (featured, bestsellers, newArrivals, deals, choice).
- Fixed `ProductView.tsx` related products fetch — same `{products:[]}` format issue; added `Array.isArray` check.
- Fixed Turbopack cache corruption — cleared `.next`, restarted dev server with daemon script (double-fork pattern) for process persistence across Bash tool calls.

### Verification
- `bun run lint` → ✅ passes cleanly.
- Database seeded: 6 categories, 32 products, **172 reviews** (real Arabic copy).
- API routes verified: `/api/products` (with all new filters), `/api/products/[id]` (with reviews), `/api/reviews` (GET + POST), `/api/orders` (GET list + GET single + POST create + PATCH advance), `/api/categories`.
- All 10 views return HTTP 200: home, shop (with filters), search, product (with gallery+reviews), cart, checkout (3-step), orders, order-detail (with tracking), wishlist, order-success.
- End-to-end flow tested via Agent Browser: browse home → view product (gallery, reviews, bundles) → add to cart → checkout (address → payment → review) → confirm order → order-success → order-detail (tracking timeline). Order created in DB with tracking number + timeline.
- dev.log shows no runtime errors — only successful GET/POST requests.

### Stage Summary
The store is now a full **Amazon-style** beauty shopping experience in Arabic RTL. It includes: Amazon-style header with category search dropdown + mega-nav; advanced product browsing with sidebar filters (price, rating, brand, availability) + pagination + sort; rich product detail pages with image gallery, frequently-bought-together bundles, customer reviews with rating histogram + review submission; cart with save-for-later + free shipping progress + recommendations; 3-step checkout (address → payment → review) with card form + saved addresses/payment methods; order history with status filters + search; order detail with package tracking timeline + invoice download + reorder; wishlist; recently viewed. 172 Arabic reviews seeded across 32 products. All flows work end-to-end and lint passes cleanly.

---

## Task ID: 6
**Agent name:** Admin Dashboard Builder (Z.ai Code main agent)
**Task description:** Build a comprehensive admin dashboard (لوحة التحكم) for the existing Arabic beauty e-commerce store (جلورية), accessible via `?view=admin`, with 5 sections (dashboard, products, categories, orders, reviews), full CRUD, order timeline management, review moderation, KPIs + revenue chart, all in Arabic RTL with the existing rose/gold theme.

### Work Log
- **New admin API routes** (all `force-dynamic`, zod-validated):
  - `src/app/api/admin/stats/route.ts` — `GET` returns aggregate stats: totalProducts, totalCategories, totalOrders, totalRevenue, pendingOrders, lowStockProducts (stock<10), totalReviews, avgRating, ordersByStatus (6 buckets), revenueByDay (last 7 days with Arabic day labels), recentOrders (last 5 with items), topProducts (top 5 by reviewCount), lowStockList (top 10 low-stock with category).
  - `src/app/api/products/route.ts` — added `POST` (create product) with zod schema (name, description, price, oldPrice?, image, images[], categoryId, stock, brand, shades[], isFeatured/isBestseller/isNew/isChoice/prime switches, ingredients?, weight?, origin?). Verifies category exists. Returns 201 with category included. Kept existing GET unchanged.
  - `src/app/api/products/[id]/route.ts` — added `PUT` (update, same schema) + `DELETE` (blocks with 400 Arabic message if order items reference the product; reviews cascade-delete via schema). Kept existing GET.
  - `src/app/api/categories/route.ts` — added `POST` (create category: name, nameEn, description?, image?, icon?). Auto-generates unique slug from nameEn. Returns 201 with product count. Kept existing GET.
  - `src/app/api/categories/[id]/route.ts` — NEW. `GET` single + `PUT` (update) + `DELETE` (returns 400 with "لا يمكن حذف فئة بها منتجات. انقلي المنتجات أولاً" if products exist).
  - `src/app/api/reviews/route.ts` — enhanced `GET`: when no `productId` provided, returns ALL reviews (limit 200) with `product` relation joined (id, name, image). When `productId` provided, returns bare array (backward compatible — keeps ProductView working). Kept POST.
  - `src/app/api/reviews/[id]/route.ts` — NEW. `DELETE` (deletes review + recomputes product rating & reviewCount via aggregate) + `PUT` (toggle verified / set helpful).
- **Modified `src/app/page.tsx`**: when `view === "admin"`, renders ONLY `<AdminView />` (no Header, no Footer, no CartDrawer) so admin has its own full-screen chrome. Added `"admin"` to KNOWN_VIEWS. All other views keep the existing Header/CartDrawer/Footer wrapper.
- **`src/components/views/AdminView.tsx`** — full-screen `h-screen` RTL dashboard shell:
  - Right sidebar (260px, RTL): dark gradient `from-slate-900 via-slate-900 to-rose-950`, brand "جلورية | لوحة التحكم" with Sparkles logo, 5 nav items (LayoutDashboard لوحة المعلومات, Package المنتجات, Tags الفئات, ShoppingBag الطلبات, MessageSquare المراجعات) + "العودة للمتجر" (Store → ?view=home), active item highlighted with rose accent bar (framer-motion layoutId), admin user card at bottom (avatar + "مدير المتجر" + email).
  - Topbar: hamburger (mobile), section title + subtitle, quick search input, notifications bell with rose dot, "إضافة منتج" quick button (hidden on products/categories tabs).
  - Content area: scrollable, AnimatePresence page transitions on tab change.
  - Tab switching via `?view=admin&tab=dashboard|products|categories|orders|reviews` (shareable URLs, default dashboard).
  - Responsive: sidebar collapses into Sheet on mobile (hamburger opens right-side drawer).
  - Extracted `SidebarContent` as a top-level component (not created during render) to satisfy `react-hooks/static-components` lint rule.
- **`src/components/admin/AdminDashboard.tsx`** — stats overview:
  - 4 KPI cards (إجمالي المنتجات / إجمالي الطلبات / إجمالي الإيرادات / متوسط التقييم) with colored icon circles + trend subtext.
  - Revenue last 7 days: recharts `<BarChart>` with rose bars (`#e11d48` for days with revenue, `#fecdd3` for zero days), Arabic day labels, custom Tooltip.
  - Orders by status: list of 6 status chips with colored dots + counts.
  - Recent orders table: last 5 orders (#last8, customer, total, status badge, date).
  - Top products: top 5 by reviewCount with rank badge + star rating + review count.
  - Low stock alert card: grid of products with stock<10 (image, name, category, stock badge red/amber), CTA to products tab.
- **`src/components/admin/AdminProducts.tsx` + `ProductForm.tsx`** — product management:
  - Toolbar: search input (name/brand/description), category filter dropdown, "إضافة منتج" button, results count.
  - Table: image thumbnail, name+brand, category, price (+ oldPrice strikethrough), stock badge (red=0, amber<10, green), flag badges (مميز rose / الأكثر مبيعاً amber / جديد emerald / اختيار جلورية purple / Prime outline), rating with stars, edit/delete actions.
  - Pagination (10 per page) with prev/next + page indicator.
  - `ProductForm` Dialog (max-w-3xl, scrollable): sections for المعلومات الأساسية (name, description, brand, category select), السعر والمخزون (price, oldPrice, stock), الصور (main image URL + extra images comma-separated + live preview thumbnails), تفاصيل إضافية (weight, origin, shades comma-separated, ingredients textarea), السمات والتمييز (5 switches). Save → POST (new) or PUT (edit). Toasts on success/error.
  - Delete: AlertDialog confirm → DELETE → toast + refresh.
- **`src/components/admin/AdminCategories.tsx` + `CategoryForm.tsx`** — category management:
  - Toolbar: count + "إضافة فئة" button.
  - Grid of category cards: image (with gradient overlay), name (AR + EN), product count badge, slug, edit/delete buttons.
  - `CategoryForm` Dialog: name (AR), nameEn (EN), description, image URL + preview, icon (Lucide name). Save → POST/PUT.
  - Delete: AlertDialog confirm → DELETE (API returns 400 with Arabic message if has products → toast error).
- **`src/components/admin/AdminOrders.tsx`** — order management:
  - Toolbar: search (id/customer/phone/tracking), status filter (7 options), count.
  - Table: order # (last 8), customer name+phone, items count, total, payment method label, status badge, date, view action.
  - Row click → opens order detail Sheet (slides from left for RTL, full-width on mobile).
  - Sheet content: status management card (Select to change status + "تقديم الخطوة التالية" button calling PATCH with advanceTimeline:true), full timeline with checkmarks (CheckCircle2 emerald for done, Circle slate for pending, connecting line), customer info grid, payment info grid, items list with images + line totals, totals breakdown (subtotal/shipping/discount with promo code/tax/total).
- **`src/components/admin/AdminReviews.tsx`** — review moderation:
  - Toolbar: search (author/title/body/product name), rating filter (all/5/4/3/2/1), verified filter (all/verified/unverified), count.
  - Table: product thumbnail+name+date, author, 5-star display, title+body (truncated 2 lines), verified toggle button (click to flip via PUT), helpful count badge, delete action.
  - Delete: AlertDialog confirm → DELETE → toast + remove from list (product rating auto-recomputed server-side).
  - Fetches all reviews via enhanced `/api/reviews` endpoint (with product join).

### Verification
- `bun run lint` → ✅ passes cleanly (0 errors, 0 warnings after auto-fix of unused eslint-disable directives).
- `GET /?view=admin` → 200. `GET /?view=admin&tab=dashboard|products|categories|orders|reviews` → all 200.
- `GET /api/admin/stats` → 200 with full payload (totalProducts=32, totalRevenue, ordersByStatus, revenueByDay 7 entries, recentOrders, topProducts, lowStockList).
- `POST /api/products` → 201 created (verified). `PUT /api/products/[id]` → 200 updated. `DELETE /api/products/[id]` → 200 deleted.
- `POST /api/categories` → 201 created (auto slug). `GET/PUT/DELETE /api/categories/[id]` → all work. DELETE returns 400 with Arabic message when category has products.
- `GET /api/reviews` (no productId) → 200 returns all reviews with product join. `GET /api/reviews?productId=X` → 200 still returns bare array (backward compatible — ProductView unchanged).
- `POST /api/reviews` → 201 (recomputes product rating). `PUT /api/reviews/[id]` (toggle verified) → 200. `DELETE /api/reviews/[id]` → 200 (recomputes product rating + reviewCount).
- `PATCH /api/orders?id=X` with `advanceTimeline:true` → 200, advances timeline (ordered → processing → shipped → out_for_delivery → delivered) and auto-maps status.
- Storefront views (home, shop, product) still return 200 — no regressions.
- dev.log clean — only successful GET/POST/PUT/DELETE/PATCH requests, no runtime errors.

### Stage Summary
A complete, professional **admin dashboard (لوحة التحكم)** is now live at `?view=admin` for the جلورية beauty store. It runs as a separate full-screen app (no public Header/Footer/CartDrawer) with a dark slate→rose gradient sidebar, RTL Arabic layout, Tajawal font, and 5 fully-functional sections: (1) Dashboard with 4 KPI cards, recharts 7-day revenue bar chart, orders-by-status chips, recent orders table, top products list, and low-stock alert grid; (2) Products with searchable/filterable table, pagination, rich form dialog (all fields + image preview + 5 flag switches), and AlertDialog delete confirm; (3) Categories with image cards grid, product count badges, form dialog, and delete guard; (4) Orders with filterable table and detail Sheet showing timeline with checkmarks, status management (Select + advance-timeline button), customer/payment info, items list, and totals breakdown; (5) Reviews with star display, verified toggle (PUT), rating/verified filters, and delete with auto product-rating recompute. All API routes use zod validation, proper status codes (201/400/404/500), `force-dynamic`, and return bare arrays for list endpoints (consistent with existing patterns). Sonner toasts for all actions, loading skeletons, empty states, mobile-responsive (sidebar → Sheet). Lint passes cleanly with zero errors/warnings and the dev server reports no runtime errors.

---

## Task ID: 7
**Agent name:** Auth + Image Upload + Dark Mode (Z.ai Code main agent)
**Task description:** Add password authentication to the admin dashboard (with eye icon toggle + password reset), simplify image upload (drag & drop), and add dark mode.

### Work Log
- Created `src/store/admin-auth.ts` Zustand store (persisted to localStorage) with: `passwordHash` (FNV-1a hash with salt), `isAuthenticated`, `login(verify)`, `logout`, `changePassword(old,new)`, `resetPassword()`. Default password = "admin1234".
- Created `src/components/admin/AdminLogin.tsx` — full-screen dark rose gradient login with password field, **eye icon toggle** (show/hide password), login button, default-password hint, and "back to store" link.
- Created `src/components/admin/ChangePasswordDialog.tsx` — dialog with 3 fields (current, new, confirm) each with its own eye toggle, validation (min 6 chars, match confirm), and "نسيت كلمة السر؟ إعادة التعيين" button that resets to default + logs out.
- Updated `src/components/views/AdminView.tsx`:
  - Shows AdminLogin when not authenticated (gate).
  - Added "تغيير كلمة السر" nav item + "تسجيل الخروج" button in sidebar user card.
  - Added dark mode toggle button (Sun/Moon) in topbar with `suppressHydrationWarning` + CSS-only icon swap (`hidden dark:block`).
  - Added dark variant classes (`dark:bg-slate-950`, `dark:bg-slate-900`, etc.) throughout.
- Created `src/components/admin/ImageInput.tsx` — image input with 3 modes: **drag & drop** a file (converts to base64 data URL), **click to browse**, or **paste/type a URL**. Shows preview thumbnail with remove button. Validates file type + size (<1.5MB).
- Replaced plain URL text inputs in `ProductForm.tsx` and `CategoryForm.tsx` with the new `ImageInput` component for both main image and extra images.
- Added dark mode to the public store:
  - Created `src/components/theme-provider.tsx` wrapping `next-themes` ThemeProvider.
  - Updated `src/app/layout.tsx` to wrap children in ThemeProvider (attribute="class", defaultTheme="light", enableSystem=false).
  - Added dark mode toggle button (Sun/Moon) in `Header.tsx` (next to wishlist button) with suppressHydrationWarning + CSS-only icon swap.
- Verified existing `globals.css` already has `.dark` variable overrides (rose-tinted dark palette).

### Bug fixes
- Initial `useEffect(() => setMounted(true))` pattern triggered `react-hooks/set-state-in-effect` lint error. Fixed by switching to `useTheme().resolvedTheme` + `suppressHydrationWarning` + CSS-only icon swap (`hidden dark:block` / `block dark:hidden`) — no mounted flag needed, no hydration mismatch.
- Removed unused `ImagePlus` imports from ProductForm and CategoryForm after switching to ImageInput.

### Verification
- `bun run lint` → ✅ passes cleanly (0 errors).
- Admin login flow tested via Agent Browser: opened `?view=admin` → saw login screen with password field + eye toggle → entered `admin1234` → clicked login → landed on dashboard.
- Change password dialog tested: opens from sidebar, shows 3 fields each with eye toggle, has reset button.
- Dark mode tested: toggled in admin topbar → `document.documentElement.className` includes "dark" → toggled back to light. Also toggled in store header → confirmed dark class applied.
- Image upload tested: opened product form → saw "رفع"/"رابط" tab toggle + drag-drop zone "اسحبي الصورة هنا أو انقري للاختيار".
- All routes return 200: `/`, `/?view=admin`.
- `dev.log` clean — no runtime errors.

### Stage Summary
The admin dashboard is now password-protected (default "admin1234", changeable, resettable) with an eye-icon show/hide toggle on all password fields. Image uploads in product/category forms are now drag-and-drop friendly (or URL paste) with live preview. Dark mode is available site-wide (store header + admin topbar) using next-themes with the existing rose-tinted dark palette. Lint passes cleanly.

---

## Task ID: 8
**Agent name:** Customer Authentication (Z.ai Code main agent)
**Task description:** Add customer login/registration system for the store (shopper accounts) — register, login, logout, account dropdown in header, checkout prefill from logged-in customer.

### Work Log
- Created `src/store/customer-auth.ts` Zustand store (persisted to localStorage) with: `users[]` (local registered users "database"), `current` (logged-in user public data), `isAuthenticated`, `register({name,email,phone,password})` (validates min 6 chars, unique email, hashes password with FNV-1a), `login(email,password)`, `logout`, `updateProfile`.
- Created `src/components/views/AuthView.tsx` (`?view=auth`) — two-column auth page: left side branding ("انضمي إلى عائلة جلورية" + value props: تسوقي أسرع، تتبعي طلباتكِ، دفع آمن), right side form card with tabs (تسجيل الدخول / حساب جديد). Login form: email + password with eye toggle. Register form: name + email + phone + password with eye toggle. All fields with leading icons. Redirects to home (or cart if items) on success. Reads `?mode=register` param to default to register tab. "متابعة كزائرة" link for guests.
- Added `auth` to KNOWN_VIEWS in `src/app/page.tsx` and renders `<AuthView />`.
- Updated `src/components/Header.tsx` account dropdown:
  - When logged out: shows "مرحباً، تسجيل الدخول / حسابي والقوائم", dropdown has "تسجيل الدخول" (→ ?view=auth), "إنشاء حساب جديد" (→ ?view=auth&mode=register), طلباتي, قائمة الأمنيات.
  - When logged in: shows "مرحباً، [first name] / حسابي", dropdown has customer name + email, طلباتي, قائمة الأمنيات, عناويني وطرق الدفع, تسجيل الخروج.
  - Added `suppressHydrationWarning` on trigger button, `useCustomerAuth` hook, `toast` for logout confirmation.
  - Fixed logout: used `onSelect` instead of `onClick` on DropdownMenuItem (Radix requires onSelect for proper event handling).
- Updated `src/components/views/CheckoutView.tsx` to import `useCustomerAuth` and pass `customer.email` as `customerEmail` in the order payload.
- Added `LogOut`, `UserPlus`, `LogIn` icons to Header imports.

### Verification
- `bun run lint` → ✅ passes cleanly (0 errors).
- Tested via Agent Browser: opened `?view=auth` → saw login form with tabs → switched to register → filled name/email/phone/password → clicked "إنشاء الحساب" → redirected to home → header shows "مرحباً، سارة حسابي".
- Opened account dropdown (via pointerdown dispatch for Radix) → shows طلباتي, قائمة الأمنيات, عناويني وطرق الدفع, تسجيل الخروج.
- Clicked "تسجيل الخروج" → header reverted to "مرحباً، تسجيل الدخول / حسابي والقوائم" → dropdown now shows تسجيل الدخول + إنشاء حساب جديد.
- `dev.log` clean — no runtime errors.

### Stage Summary
Customers can now register and log in to the store (`?view=auth`). The header account dropdown adapts to login state (greeting + name when logged in, login/register links when logged out). Checkout passes the logged-in customer's email with the order. All auth is client-side with localStorage persistence (registered users stored locally). Lint passes cleanly.

---

## Task ID: 9
**Agent name:** PM2 Process Management (Z.ai Code main agent)
**Task description:** Set up PM2 for production-grade process management — auto-restart on crash, memory limits, background watchdog monitoring, standalone server guard for production.

### Work Log
- Installed PM2 globally via `npm install -g pm2` (v7.0.4).
- Created `ecosystem.config.js` with two app configs:
  - `glamour-dev`: runs `dev-start.sh` (next dev), fork mode, max_memory_restart 500M, max_restarts 100, min_uptime 10s, autorestart, logs to dev.log/dev.error.log.
  - `glamour`: production standalone server (disabled by default, enable after `bun run build`).
- Created `dev-start.sh` — wrapper that kills any orphaned `next-server` processes on port 3000 BEFORE starting `next dev`. This prevents port conflicts when PM2 restarts (the key issue: `next dev` spawns child `next-server` that survives parent crash, blocking the new instance).
- Created `server-guard.js` — production server wrapper with `uncaughtException`, `unhandledRejection`, `SIGTERM`, `SIGINT` handlers to prevent crashes from killing the server.
- Created `watchdog.sh` — background monitor that checks server HTTP health every 5 minutes. Uses HTTP check (not PM2 status) as source of truth. Requires 2 consecutive failures before restarting (avoids false positives). Also resurrects PM2 daemon if it dies.
- Created `start-watchdog.sh` — double-fork daemon launcher for the watchdog.
- Created `healthcheck.sh` — standalone health check script (for cron/manual use).
- Created `PM2-README.md` — comprehensive guide (Arabic) with all commands, troubleshooting, production deployment steps.
- Deleted old `start-dev.sh` (replaced by PM2 + dev-start.sh).

### Key fix
- Initial PM2 setup used `cluster` mode which showed "waiting" status due to `next dev` spawning child processes. Switched to `exec_mode: "fork"` + `dev-start.sh` wrapper that cleans orphaned processes before start. Now restarts are clean.

### Verification
- `bun run lint` → ✅ passes cleanly.
- PM2 status: `glamour-dev` online, fork mode, PID stable, memory ~78mb.
- HTTP: 200 in 0.099s (fast after compile).
- Crash recovery tested: killed PID → PM2 auto-restarted with new PID → HTTP 200 restored. `dev-start.sh` cleaned orphaned `next-server` process so new instance could bind to port 3000.
- Watchdog running (PID active), monitoring every 5 minutes.
- `pm2 save` executed — process list persisted for auto-resurrection.
- All 7 files created: ecosystem.config.js, dev-start.sh, server-guard.js, watchdog.sh, start-watchdog.sh, healthcheck.sh, PM2-README.md.

### Stage Summary
The dev server is now managed by PM2 with: auto-restart on crash (verified by kill test), 500MB memory limit restart, fork mode compatible with next dev, port cleanup on restart (dev-start.sh wrapper), background HTTP watchdog every 5 minutes, PM2 state saved for resurrection. Production config (standalone + server-guard.js with uncaughtException/unhandledRejection handlers) ready to enable after `bun run build`. Lint passes cleanly.
