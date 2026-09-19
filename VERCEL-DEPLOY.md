# 🚀 دليل النشر على Vercel — متجر أريسا

هذا الدليل يشرح كيفية نشر متجر أريسا على استضافة Vercel الحقيقية خطوة بخطوة.

## 🎉 الأتمتة الكاملة
قاعدة البيانات تعمل **تلقائياً** الآن! لا حاجة لتبديل يدوي للمخطط أو دفع المخطط أو التهيئة. عند النشر على Vercel:
- ✅ سكريبت `auto-db.mjs` يكتشف نوع قاعدة البيانات من `DATABASE_URL` ويبدّل المخطط تلقائياً
- ✅ `db push` يُشغّل تلقائياً في مرحلة البناء لإنشاء الجداول
- ✅ Middleware يهيّئ البيانات الأولية تلقائياً عند أول زيارة إذا كانت قاعدة البيانات فارغة

---

## 📋 المتطلبات

1. حساب [Vercel](https://vercel.com) (مجاني)
2. حساب [GitHub](https://github.com) (المشروع مرفوع بالفعل على `mohammed777749/arisa-beauty-store`)
3. قاعدة بيانات PostgreSQL (Vercel Postgres أو Neon — مجانية)

---

## 🗄️ الخطوة ١: إنشاء قاعدة بيانات PostgreSQL

### الخيار أ: Vercel Postgres (الأسهل — موصى به)

1. ادخلي على [vercel.com/dashboard](https://vercel.com/dashboard)
2. أنشئي مشروعاً جديداً → اختاري **Storage** → **Create Database** → **Postgres**
3. سمّيه `arisa-db`
4. انتظري حتى يصبح جاهزاً (دقيقة تقريباً)
5. انسخي `DATABASE_URL` من تفاصيل القاعدة

### الخيار ب: Neon (مجاني للأبد)

1. اذهبي إلى [neon.tech](https://neon.tech) وسجّلي مجاناً
2. أنشئي مشروعاً جديداً
3. انسخي connection string (يبدأ بـ `postgresql://`)

---

## ⚙️ الخطوة ٢: إعداد متغيرات البيئة على Vercel

في صفحة المشروع على Vercel → **Settings** → **Environment Variables**:

| المتغير | القيمة | ملاحظة |
|---------|--------|--------|
| `DATABASE_URL` | `postgresql://...` | من الخطوة ١ — **هذا كل ما تحتاجينه!** |

> **ملاحظة**: بقية الإعدادات (الشعار، الهاتف، الواتساب) مدمجة في الكود `src/lib/brand.ts`.

---

## 🚀 الخطوة ٣: النشر (تلقائي بالكامل)

### الطريقة أ: عبر GitHub (موصى بها — نشر تلقائي)

1. ادخلي [vercel.com/new](https://vercel.com/new)
2. اختاري **Import Git Repository** → `mohammed777749/arisa-beauty-store`
3. في إعدادات المشروع:
   - **Framework Preset**: Next.js (يُكشف تلقائياً)
   - **Build Command**: `bun run vercel-build` (أو اتركيه افتراضياً — Vercel سيستخدم `package.json`)
   - **Install Command**: `bun install` (أو `npm install`)
   - **Environment Variables**: أضيفي `DATABASE_URL`
4. اضغطي **Deploy** ✨

**ما يحدث تلقائياً أثناء البناء:**
1. `postinstall` → `auto-db.mjs` يكتشف PostgreSQL ويبدّل المخطط + `prisma generate`
2. `vercel-build` → `auto-db.mjs --push` يدير المخطط + يدفع الجداول + يهيّئ البيانات الأولية
3. `next build` يبني التطبيق
4. عند أول زيارة → middleware يتحقق من قاعدة البيانات ويهيئها إذا كانت فارغة

### الطريقة ب: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# من مجلد المشروع
cd /home/z/my-project

# النشر (سيطلب DATABASE_URL)
vercel --prod
```

---

## ✅ انتهى! لا حاجة لخطوات إضافية

بعد النشر، متجرك سيعمل على: `https://arisa-beauty-store.vercel.app`

ستجدين:
- ✅ ٦ فئات منتجات
- ✅ ٣٢ منتجاً مع الأسعار والصور
- ✅ ١٧٢ مراجعة عربية
- ✅ ١٨ خدمة تجميل
- ✅ لوحة تحكم محمية بكلمة سر (`admin1234`)
- ✅ كل الميزات تعمل

---

## ⚠️ ملاحظات

### الصور المرفوعة
الصور المرفوعة من لوحة التحكم تُحفظ كـ Base64 في قاعدة البيانات — يعمل على Vercel بدون إعداد إضافي. للحجم الكبير استخدمي [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).

### المنطقة
`vercel.json` يحدد `sin1` (سنغافورة). لتغييرها عدّلي الملف.

### التحديثات
كل `git push` إلى `main` يطلق نشراً تلقائياً:
```bash
git add -A && git commit -m "تحديث" && git push origin main
```

---

## 🆘 حل المشاكل

| المشكلة | الحل |
|---------|------|
| `PrismaClientInitializationError` | تأكدي من `DATABASE_URL` صحيح في Vercel env vars |
| صفحة فارغة | راجعي Vercel → Functions → Logs |
| البيانات فارغة بعد النشر | الموقع سيهيّئها تلقائياً عند أول زيارة، أو شغّلي: `curl https://your-app.vercel.app/api/seed` |
| `Database doesn't exist` | تأكدي من إنشاء قاعدة البيانات على Vercel Postgres أولاً |
| أخطاء TypeScript | `next.config.ts` يتجاهل أخطاء البناء |

---

## 🔧 الأتمتة المُطبّقة (تفاصيل تقنية)

### `scripts/auto-db.mjs`
سكريبت ذكي يُشغّل في:
- `postinstall` (بعد تثبيت الحزم)
- `dev` (عند تشغيل الخادم محلياً)
- `build` و `vercel-build` (مرحلة البناء)

يقوم بـ:
1. **اكتشاف نوع قاعدة البيانات** من `DATABASE_URL` (sqlite/postgresql/mysql)
2. **تبديل المخطط** تلقائياً (ينسخ `schema.pg.prisma` أو `schema.sqlite.prisma`)
3. **`prisma generate`** دائماً
4. **`db push`** في مرحلة البناء فقط (`--push` flag أو `VERCEL=1`)
5. **التهيئة التلقائية للبيانات** في بيئة Vercel (optional `--seed`)

### `src/middleware.ts`
يتحقق من كل طلب HTML — إذا كانت قاعدة البيانات فارغة، يستدعي `/api/seed` تلقائياً في الخلفية. آمن: لا يوقف الطلب، ويتخطى API/الملفات الثابتة.

### `src/app/api/seed/route.ts` (idempotent)
أصبح idempotent — يتحقق أولاً إذا كانت البيانات موجودة، ويتخطى التهيئة. آمن للتشغيل المتكرر.

