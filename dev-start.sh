#!/bin/bash
# ============================================================
#  dev-start.sh — مُغلِّف تشغيل سيرفر التطوير
#
#  ينظّف أي عملية next-server معلّقة على المنفذ 3000 قبل البدء،
#  ثم يُشغّل next dev. هذا يمنع تعارض المنافذ عند إعادة تشغيل PM2.
# ============================================================

PORT=3000

# 1) اقتل أي عملية next-server معلّقة تستخدم المنفذ
PIDS=$(lsof -ti tcp:${PORT} 2>/dev/null || ss -tlnp 2>/dev/null | grep ":${PORT} " | grep -oP 'pid=\K\d+' || true)
if [ -n "$PIDS" ]; then
  echo "[dev-start] تنظيف العمليات المعلّقة على المنفذ ${PORT}: $PIDS"
  for p in $PIDS; do
    kill -9 "$p" 2>/dev/null || true
  done
  sleep 2
fi

# 2) تأكد من خلو المنفذ
if lsof -i tcp:${PORT} 2>/dev/null | grep -q LISTEN; then
  echo "[dev-start] ⚠️ المنفذ ${PORT} لا يزال مستخدماً"
fi

# 3) شغّل next dev (يستبدل العملية الحالية)
exec node_modules/next/dist/bin/next dev -p ${PORT}
