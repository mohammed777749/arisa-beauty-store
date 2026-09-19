import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أريسا | صالون التجميل ومتجر المستحضرات الفاخرة",
  description:
    "أريسا - وجهتكِ الأولى للتجميل الفاخر. مكياج، عناية بالبشرة، عطور، شعر، أظافر وشفاه، بالإضافة إلى خدمات تجميل احترافية وتجهيز عرايس. شحن سريع ودفع آمن.",
  keywords: [
    "تجميل",
    "مكياج",
    "عطور",
    "عناية بالبشرة",
    "أحمر شفاه",
    "أريسا",
    "صالون تجميل",
    "تجهيز عرايس",
    "مستحضرات تجميل",
    "تسوق إلكتروني",
  ],
  authors: [{ name: "أريسا" }],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "أريسا | صالون التجميل ومتجر المستحضرات الفاخرة",
    description:
      "وجهتكِ الأولى للتجميل الفاخر. مكياج، عناية بالبشرة، عطور، خدمات تجميل وتجهيز عرايس.",
    siteName: "أريسا",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
