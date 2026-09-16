#!/bin/bash
# ============================================================
#  watchdog.sh — مراقب خلفي لـ PM2 وسيرفر جلورية
#
#  يعمل في الخلفية ويقوم بـ:
#  1. التأكد من أن daemon الخاص بـ PM2 يعمل
#  2. فحص صحة السيرفر (HTTP) كل 5 دقائق وإعادة تشغيله عند التعطل
#
#  ملاحظة: نعتمد على فحص HTTP كمصدر رئيسي للحقيقة — حالة PM2
#  قد تُظهر "waiting" عابرة حتى عندما يكون السيرفر سليماً.
# ============================================================

PM2_BIN="/home/z/.npm-global/bin/pm2"
APP_NAME="glamour-dev"
PORT=3000
HEALTH_URL="http://localhost:${PORT}/"
LOG_FILE="/home/z/my-project/server-monitor.log"
INTERVAL=300  # 5 دقائق
FAIL_THRESHOLD=2  # يحتاج فشلين متتاليين قبل إعادة التشغيل

trim_log() {
  if [ -f "$LOG_FILE" ] && [ "$(wc -l < "$LOG_FILE")" -gt 2000 ]; then
    tail -n 1000 "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"
  fi
}

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

fail_count=0

while true; do
  trim_log

  # 1) تأكد من أن PM2 daemon يعمل
  if ! "$PM2_BIN" ping > /dev/null 2>&1; then
    log "⚠️  PM2 daemon غير متاح. جارٍ إحياؤه..."
    "$PM2_BIN" resurrect >> "$LOG_FILE" 2>&1
    sleep 8
    continue
  fi

  # 2) فحص HTTP — المصدر الرئيسي للحقيقة
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$HEALTH_URL" 2>/dev/null)

  if [ "$RESPONSE" = "200" ]; then
    # السيرفر صحي — صفّار عدّاد الفشل
    if [ "$fail_count" -gt 0 ]; then
      log "✅ السيرفر عاد للعمل (HTTP 200)."
    fi
    fail_count=0
  else
    fail_count=$((fail_count + 1))
    log "⚠️  فحص فاشل #$fail_count (HTTP ${RESPONSE:-000})."

    if [ "$fail_count" -ge "$FAIL_THRESHOLD" ]; then
      log "🔄 تجاوز عتبة الفشل. جارٍ إعادة تشغيل '$APP_NAME'..."
      "$PM2_BIN" restart "$APP_NAME" --update-env >> "$LOG_FILE" 2>&1
      sleep 15
      RECHECK=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$HEALTH_URL" 2>/dev/null)
      if [ "$RECHECK" = "200" ]; then
        log "✅ تمت إعادة التشغيل بنجاح."
        fail_count=0
      else
        log "❌ فشلت إعادة التشغيل (HTTP ${RECHECK:-000})."
      fi
    fi
  fi

  sleep "$INTERVAL"
done
