# 🚀 دليل النشر على Vercel — متجر أريسا

هذا الدليل يشرح كيفية نشر متجر أريسا على استضافة Vercel الحقيقية خطوة بخطوة.

## 📋 المتطلبات

1. حساب [Vercel](https://vercel.com) (مجاني)
2. حساب [GitHub](https://github.com) (المشروع مرفوع بالفعل على `mohammed777749/arisa-beauty-store`)
3. قاعدة بيانات PostgreSQL (Vercel Postgres أو Neon — مجانية)

---

## 🗄️ الخطوة ١: إنشاء قاعدة بيانات PostgreSQL

### الخيار أ: Vercel Postgres (الأسهل)

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
| `DATABASE_URL` | `postgresql://...` | من الخطوة ١ |

> **ملاحظة**: بقية الإعدادات (الشعار، الهاتف، الواتساب) مدمجة في الكود `src/lib/brand.ts`. لتغييرها عدّلي الملف وأعيدي الرفع.

---

## 🔧 الخطوة ٣: تبديل قاعدة البيانات إلى PostgreSQL

قبل النشر، يجب تبديل مخطط Prisma من SQLite إلى PostgreSQL:

```bash
# محلياً — للتأكد أن البناء سيعمل على Vercel
bun run prisma:use-pg

# هذا ينسخ prisma/schema.pg.prisma إلى prisma/schema.prisma
# ثم يشغل prisma generate

# للعودة إلى SQLite (للتطوير المحلي):
bun run prisma:use-sqlite
```

> **طريقة بديلة على Vercel**: في إعدادات المشروع → **Build Command**:
> ```
> bun run prisma:use-pg && bun run vercel-build
> ```

---

## 📥 الخطوة ٤: دفع المخطط إلى قاعدة البيانات

بعد إنشاء قاعدة البيانات على Vercel، ادفعي المخطط:

```bash
# محلياً — تأكدي أن DATABASE_URL يشير إلى PostgreSQL
export DATABASE_URL="postgresql://..."  # من Vercel
bun run prisma:use-pg
bun run db:push

# هذا ينشئ كل الجداول في قاعدة البيانات
```

---

## 🌱 الخطوة ٥: تهيئة البيانات الأولية

بعد دفع المخطط، شغّلي سكريبت التهيئة لإدراج المنتجات والخدمات:

```bash
# شغّلي السكريبت محلياً مع DATABASE_URL لـ PostgreSQL
export DATABASE_URL="postgresql://..."
bun run db:seed

# أو عبر API (بعد النشر):
curl https://your-domain.vercel.app/api/seed
```

سيُدرج: ٦ فئات، ٣٢ منتجاً، ١٧٢ مراجعة، ١٨ خدمة تجميل.

---

## 🚀 الخطوة ٦: النشر على Vercel

### الطريقة أ: عبر GitHub (موصى بها — نشر تلقائي)

1. ادخلي [vercel.com/new](https://vercel.com/new)
2. اختاري **Import Git Repository**
3. اختاري `mohammed777749/arisa-beauty-store`
4. في إعدادات المشروع:
   - **Framework Preset**: Next.js (يُكشف تلقائياً)
   - **Build Command**: `bun run vercel-build` (أو اتركيه افتراضياً)
   - **Install Command**: `bun install` (أو `npm install`)
   - **Environment Variables**: أضيفي `DATABASE_URL`
5. اضغطي **Deploy**

### الطريقة ب: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# من مجلد المشروع
cd /home/z/my-project
vercel

# اتبعي التعليمات — Vercel سيكتشف Next.js تلقائياً
# أضيفي DATABASE_URL عند السؤال عن Environment Variables

# للنشر للإنتاج:
vercel --prod
```

---

## ⚠️ ملاحظات مهمة

### ١. نظام الملفات للقراءة فقط
Vercel لا يسمح بالكتابة على نظام الملفات. المشروع يستخدم:
- ✅ **قاعدة البيانات**: PostgreSQL (يعمل)
- ✅ **localStorage**: للسلة والمفضلة وكلمة سر الأدمن (يعمل في المتصفح)
- ⚠️ **الصور المرفوعة**: تُحفظ كـ Base64 في قاعدة البيانات (يعمل، لكن للحجم الكبير استخدمي Vercel Blob)

### ٢. الصور المرفوعة (Base64)
الصور المرفوعة من لوحة التحكم تُحفظ كـ Base64 في قاعدة البيانات. هذا يعمل على Vercel لكن:
- ✅ بسيط ولا يحتاج إعداد إضافي
- ⚠️ يضخّم قاعدة البيانات
- للحجم الكبير: استخدمي [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (مدفوع)

### ٣. تحديد حجم الطلب
تم تعيين `bodySizeLimit: "10mb"` في `next.config.ts` لدعم رفع الصور.

### ٤. المنطقة
`vercel.json` يحدد `sin1` (سنغافورة) كمنطقة. لتغييرها عدّلي الملف. المناطق المتاحة: `iad1` (شرق أمريكا)، `sfo1` (غرب أمريكا)، `fra1` (فرانكفورت)، `sin1` (سنغافورة).

---

## 🔄 التحديثات

كل دفعة (push) إلى فرع `main` على GitHub ستُطلق نشراً تلقائياً على Vercel.

```bash
git add -A
git commit -m "تحديث"
git push origin main
# Vercel سينشر تلقائياً
```

---

## 🆘 حل المشاكل

| المشكلة | الحل |
|---------|------|
| `PrismaClientInitializationError` | تأكدي من `DATABASE_URL` صحيح + شغّلي `bun run prisma:use-pg` |
| `Database doesn't exist` | شغّلي `bun run db:push` بعد ضبط `DATABASE_URL` |
| صفحة فارغة بعد النشر | راجعي Vercel Function Logs |
| `Module not found` | شغّلي `bun install` محلياً + ارفعي `package.json` |
| أخطاء TypeScript | `next.config.ts` يتجاهل أخطاء البناء (`ignoreBuildErrors: true`) |

---

## ✅ قائمة التحقق قبل النشر

- [ ] إنشاء قاعدة بيانات PostgreSQL على Vercel/Neon
- [ ] إضافة `DATABASE_URL` في Environment Variables
- [ ] تشغيل `bun run prisma:use-pg` محلياً
- [ ] دفع المخطط: `bun run db:push`
- [ ] تهيئة البيانات: `bun run db:seed`
- [ ] رفع التغييرات لـ GitHub: `git push`
- [ ] تأكيد النشر على Vercel
- [ ] زيارة الرابط والتحقق من العمل

بعد إكمال هذه الخطوات، متجرك سيعمل على: `https://arisa-beauty-store.vercel.app` 🌹
