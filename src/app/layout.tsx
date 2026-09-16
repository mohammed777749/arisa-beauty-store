import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "جلورية | متجر التجميل والمستحضرات الفاخرة",
  description:
    "جلورية - وجهتك الأولى للتجميل الفاخر. مكياج، عناية بالبشرة، عطور، شعر، أظافر وشفاه بأرقى الماركات وأفضل الأسعار. شحن سريع ودفع آمن.",
  keywords: [
    "تجميل",
    "مكياج",
    "عطور",
    "عناية بالبشرة",
    "أحمر شفاه",
    "جلورية",
    "مستحضرات تجميل",
    "تسوق إلكتروني",
  ],
  authors: [{ name: "جلورية" }],
  openGraph: {
    title: "جلورية | متجر التجميل والمستحضرات الفاخرة",
    description:
      "وجهتك الأولى للتجميل الفاخر. مكياج، عناية بالبشرة، عطور وأكثر.",
    siteName: "جلورية",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
