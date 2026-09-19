import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // لا نستخدم standalone على Vercel — فهو يدير البناء تلقائياً
  // output: "standalone",  ← تم التعطيل لـ Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    // السماح بكل مصادر الصور (base64 data URLs + روابط خارجية)
    // مطلوب لـ Vercel لمعالجة صور المنتجات والشعار
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  // دعم البيانات الكبيرة (base64 للصور المرفوعة في قاعدة البيانات)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
