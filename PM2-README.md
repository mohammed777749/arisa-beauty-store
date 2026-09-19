# 🚀 إدارة العمليات بـ PM2 — متجر جلورية

دليل تشغيل وصيانة السيرفر باستخدام PM2 لضمان الاستقرار وإعادة التشغيل التلقائي.

## 📋 الملفات

| الملف | الوصف |
|------|-------|
| `ecosystem.config.js` | إعداد PM2 (تطوير + إنتاج) |
| `dev-start.sh` | مُغلِّف تشغيل سيرفر التطوير (ينظّف المنفذ أولاً) |
| `server-guard.js` | غلاف حماية لسيرفر الإنتاج (معالجة الأخطاء) |
| `healthcheck.sh` | فحص صحة السيرفر (لاستخدام cron) |
| `watchdog.sh` | مراقب خلفي — يفحص كل ٥ دقائق ويعيد التشغيل عند التعطل |
| `start-watchdog.sh` | يشغّل المراقب كعملية خلفية منفصلة |

## ⚡ التشغيل السريع

```bash
# تشغيل سيرفر التطوير تحت PM2
pm2 start ecosystem.config.js --only glamour-dev

# حفظ القائمة (لإعادة التشغيل تلقائياً)
pm2 save

# تشغيل المراقب الخلفي
bash start-watchdog.sh
```

## 🔧 أوامر PM2 الأساسية

```bash
pm2 list                    # عرض حالة كل التطبيقات
pm2 logs glamour-dev        # متابعة السجلات (مباشر)
pm2 logs glamour-dev --lines 50  # آخر ٥٠ سطر
pm2 restart glamour-dev     # إعادة تشغيل
pm2 stop glamour-dev        # إيقاف
pm2 delete glamour-dev      # حذف
pm2 flush glamour-dev       # مسح السجلات
pm2 describe glamour-dev    # تفاصيل التطبيق
pm2 monit                   # مراقبة حية (CPU/ذاكرة)
pm2 reset glamour-dev       # تصفير عدّاد إعادة التشغيل
```

## 🛡️ الميزات المُفعّلة

| الميزة | القيمة | الوصف |
|-------|-------|-------|
| `exec_mode` | `fork` | وضع fork (متوافق مع next dev) |
| `autorestart` | `true` | إعادة تشغيل تلقائي عند التعطل |
| `max_memory_restart` | `500M` | إعادة تشغيل عند تجاوز ٥٠٠ ميجابايت ذاكرة |
| `max_restarts` | `100` | أقصى عدد إعادات تشغيل |
| `min_uptime` | `10s` | حد أدنى للتشغيل قبل اعتبار العملية مستقرة |
| `restart_delay` | `4000ms` | تأخير بين إعادات التشغيل |
| `exp_backoff_restart_delay` | `100` | تأخير أُسي لتجنب حلقات إعادة التشغيل |

## 🔄 الإنتاج (Standalone)

عند الانتقال للإنتاج:

```bash
# 1. بناء المشروع
bun run build

# 2. نسخ الملفات الثابتة (يتم تلقائياً في build script)
#    cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

# 3. تفعيل سيرفر الإنتاج في ecosystem.config.js
#    غيّر `disabled: true` إلى `disabled: false` في قسم "glamour"

# 4. التشغيل بسيرفر الإنتاج (مع غلاف الحماية)
pm2 start ecosystem.config.js --only glamour

# 5. حفظ
pm2 save
```

`server-guard.js` يضيف معالجات للأخطاء غير المعالجة (`uncaughtException`،
`unhandledRejection`) وإشارات النظام (`SIGTERM`، `SIGINT`) لمنع تعطل السيرفر.

## 📊 المراقبة

### المراقب الخلفي (يعمل الآن)
يفحص صحة السيرفر كل ٥ دقائق:
- فحص HTTP على `http://localhost:3000/`
- إعادة تشغيل عبر PM2 عند فشلين متتاليين
- إحياء PM2 daemon إذا تعطّل
- السجل: `server-monitor.log`

```bash
# عرض سجل المراقب
tail -f server-monitor.log

# إيقاف المراقب
pkill -f watchdog.sh
```

### الفحص اليدوي
```bash
bash healthcheck.sh
```

## 🔍 حل المشاكل الشائعة

| المشكلة | الحل |
|---------|------|
| السيرفر متوقف | `pm2 restart glamour-dev` |
| المنفذ ٣٠٠٠ مستخدم | `dev-start.sh` ينظّفه تلقائياً، أو `pkill -f next-server` |
| خطأ في الكود | `pm2 logs glamour-dev` للتحقق |
| ذاكرة عالية | `pm2 monit` للمراقبة، `max_memory_restart` يعيد التشغيل تلقائياً |
| حالة "waiting" | `pm2 reset glamour-dev && pm2 restart glamour-dev` |
| تجميع بطيء | احذف `.next`: `rm -rf .next && pm2 restart glamour-dev` |

## ✅ الحالة الحالية

- ✅ PM2 مثبّت (v7.0.4)
- ✅ سيرفر التطوير يعمل تحت PM2 (`glamour-dev`، وضع fork)
- ✅ إعادة تشغيل تلقائي عند التعطل
- ✅ إعادة تشغيل عند تجاوز ٥٠٠ ميجابايت ذاكرة
- ✅ مراقب خلفي يفحص كل ٥ دقائق
- ✅ قائمة PM2 محفوظة (`pm2 save`)
- ✅ سكريبت تنظيف المنفذ قبل كل بدء
- ✅ غلاف حماية جاهز للإنتاج (`server-guard.js`)
