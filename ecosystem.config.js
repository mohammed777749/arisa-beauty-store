/**
 * PM2 Ecosystem Configuration — جلورية (Glamour Beauty Store)
 *
 * إعدادان:
 *  - "glamour-dev":    يشغّل سيرفر التطوير (next dev) — للاستخدام في هذه البيئة.
 *  - "glamour":        يشغّل سيرفر الإنتاج (standalone) — بعد تشغيل `bun run build`.
 *
 * التشغيل:
 *   pm2 start ecosystem.config.js                    # يشغّل كل التطبيقات
 *   pm2 start ecosystem.config.js --only glamour-dev # يشغّل التطوير فقط
 *   pm2 start ecosystem.config.js --only glamour     # يشغّل الإنتاج فقط (بعد البناء)
 *
 * بعدها:
 *   pm2 save        # حفظ القائمة
 *   pm2 startup     # التشغيل تلقائياً مع النظام
 */

module.exports = {
  apps: [
    {
      // ===== سيرفر التطوير =====
      name: "glamour-dev",
      script: "dev-start.sh",
      cwd: __dirname,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      max_memory_restart: "500M",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_restarts: 100,
      min_uptime: "10s",
      restart_delay: 4000,
      watch: false,
      exp_backoff_restart_delay: 100,
      kill_timeout: 5000,
      listen_timeout: 10000,
      out_file: "./dev.log",
      error_file: "./dev.error.log",
      merge_logs: true,
      time: true,
    },
    {
      // ===== سيرفر الإنتاج (standalone) =====
      // فعّلي هذا بعد تشغيل: bun run build
      name: "glamour",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      max_memory_restart: "500M",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
      watch: false,
      exp_backoff_restart_delay: 100,
      kill_timeout: 5000,
      listen_timeout: 10000,
      out_file: "./server.log",
      error_file: "./server.error.log",
      merge_logs: true,
      time: true,
      // لا يشغّل تلقائياً مع `pm2 start ecosystem.config.js` إلا إذا طُلب صراحة
      disabled: true,
    },
  ],
};
