import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware للتحقق التلقائي من تهيئة قاعدة البيانات.
 *
 * عند أول زيارة للموقع (أو بعد نشر جديد بقاعدة فارغة)، يستدعي /api/seed
 * تلقائياً لتهيئة البيانات الأولية. بعد ذلك لا يفعل شيئاً (الـ seed route
 * نفسه يتحقق من فراغ القاعدة ويتخطى التهيئة إذا كانت البيانات موجودة).
 *
 * لتجنب إبطاء كل طلب، نستخدم متغير بيئة محلي (في الذاكرة) كعلامة أن
 * التحقق تم في هذه الدالة. على Vercel، كل دالة serverless لها ذاكرتها
 * الخاصة، لكن هذا يقلل الفحوصات المتكررة في نفس النسخة.
 */
let checkedInThisInstance = false;

export async function middleware(_request: NextRequest) {
  // تخطي المسارات غير HTML (API، ملفات ثابتة، صور)
  const url = _request.nextUrl;
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // إذا تم التحقق في هذه النسخة، تخطي
  if (checkedInThisInstance) {
    return NextResponse.next();
  }

  try {
    // استدعاء seed endpoint في الخلفية (لا نوقف الطلب)
    // نستخدم fetch داخلي سريع — seed route يتحقق من فراغ القاعدة
    const origin = _request.nextUrl.origin;
    // مهلة قصيرة جداً — إذا لم يكتمل، نكمل الطلب ونحاول لاحقاً
    await Promise.race([
      fetch(`${origin}/api/seed`, {
        method: "GET",
        headers: { "x-middleware-auto-seed": "1" },
      }).catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
    checkedInThisInstance = true;
  } catch {
    // تجاهل الأخطاء — لا نوقف المستخدم
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
