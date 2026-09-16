#!/bin/bash
# start-watchdog.sh — يشغّل المراقب الخلفي بشكل منفصل تماماً عن الـ terminal
cd /home/z/my-project
chmod +x watchdog.sh healthcheck.sh
# Double-fork daemon pattern لإبقاء المراقب حياً بعد إغلاق الـ terminal
(
  (
    exec bash /home/z/my-project/watchdog.sh > /dev/null 2>&1
  ) &
) &
disown -a 2>/dev/null
echo "Watchdog started (PID: $!)"
