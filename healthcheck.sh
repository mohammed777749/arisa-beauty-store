#!/bin/bash
# ============================================================
#  healthcheck.sh — مراقبة صحة سيرفر جلورية
#  يفحص السيرفر كل تشغيل، ويعيد تشغيله عبر PM2 إذا كان متوقفاً.
#
#  الاستخدام اليدوي:
#    bash /home/z/my-project/healthcheck.sh
#
#  كـ cron job (كل 5 دقائق):
#    crontab -e
#    */5 * * * * /bin/bash /home/z/my-project/healthcheck.sh
# ============================================================

PORT=3000
APP_NAME="glamour-dev"
URL="http://localhost:${PORT}/"
LOG_FILE="/home/z/my-project/server-monitor.log"
MAX_LOG_LINES=1000

# إبقاء ملف السجل بحجم معقول
if [ -f "$LOG_FILE" ] && [ "$(wc -l < "$LOG_FILE")" -gt "$MAX_LOG_LINES" ]; then
  tail -n 500 "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"
fi

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$URL" 2>/dev/null)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

if [ "$RESPONSE" != "200" ]; then
  echo "${TIMESTAMP} - ⚠️  السيرفر لا يستجيب (HTTP ${RESPONSE:-000}). جارٍ إعادة التشغيل..." >> "$LOG_FILE"
  # إعادة تشغيل التطبيق عبر PM2
  pm2 restart "$APP_NAME" --update-env 2>> "$LOG_FILE"
  sleep 8
  # تحقق ثانٍ بعد إعادة التشغيل
  RECHECK=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$URL" 2>/dev/null)
  if [ "$RECHECK" = "200" ]; then
    echo "${TIMESTAMP} - ✅ تمت إعادة التشغيل بنجاح. السيرفر متاح الآن." >> "$LOG_FILE"
  else
    echo "${TIMESTAMP} - ❌ فشلت إعادة التشغيل (HTTP ${RECHECK:-000}). تحقّقي من pm2 logs ${APP_NAME}." >> "$LOG_FILE"
  fi
else
  # تسجيل صحة دورية مختصرة كل ساعة فقط (لتقليل حجم السجل)
  MINUTE=$(date '+%M')
  if [ "$MINUTE" = "00" ]; then
    echo "${TIMESTAMP} - ✅ السيرفر يعمل بشكل طبيعي (HTTP 200)." >> "$LOG_FILE"
  fi
fi

exit 0
