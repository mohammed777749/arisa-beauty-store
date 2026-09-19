import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { organizationJsonLd, websiteJsonLd, storeJsonLd } from "@/lib/seo";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const siteUrl = "https://arisa-beauty-store.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "أريسا | صالون التجميل ومتجر المستحضرات الفاخرة",
    template: "%s | أريسا",
  },
  description:
    "أريسا — وجهتكِ الأولى للتجميل الفاخر في السعودية. مكياج، عناية بالبشرة، عطور، شعر، أظافر، شفاه، بالإضافة إلى خدمات تجميل احترافية: تجهيز عرايس، تكبير شفايف، فيشيز ذهبي، ليزر، سبا. شحن سريع ودفع عند الاستلام.",
  keywords: [
    "أريسا",
    "تجميل",
    "مكياج",
    "عطور",
    "عناية بالبشرة",
    "أحمر شفاه",
    "صالون تجميل",
    "تجهيز عرايس",
    "تكبير شفايف",
    "فيليش ذهبي",
    "إزالة الشعر بالليزر",
    "حمام مغربي",
    "مساج",
    "مستحضرات تجميل",
    "متجر تجميل",
    "تسوق إلكتروني",
    "السعودية",
    "الرياض",
  ],
  authors: [{ name: "أريسا" }],
  creator: "أريسا",
  publisher: "أريسا",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "ar-SA": "/",
    },
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "أريسا | صالون التجميل ومتجر المستحضرات الفاخرة",
    description:
      "وجهتكِ الأولى للتجميل الفاخر في السعودية. منتجات أصلية + خدمات تجميل احترافية: تجهيز عرايس، تكبير شفايف، فيشيز ذهبي، ليزر، سبا. شحن سريع ودفع عند الاستلام.",
    url: siteUrl,
    siteName: "أريسا",
    type: "website",
    locale: "ar_SA",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1344,
        height: 768,
        alt: "أريسا - صالون التجميل والمستحضرات الفاخرة",
      },
      {
        url: "/images/logo.png",
        width: 449,
        height: 450,
        alt: "شعار أريسا",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أريسا | صالون التجميل ومتجر المستحضرات الفاخرة",
    description:
      "منتجات تجميل أصلية + خدمات تجميل احترافية: تجهيز عرايس، تكبير شفايف، فيشيز ذهبي. شحن سريع ودفع عند الاستلام.",
    images: ["/images/hero.jpg"],
  },
  category: "shopping",
  other: {
    "theme-color": "#e11d48",
    "msapplication-TileColor": "#e11d48",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(storeJsonLd),
          }}
        />
      </head>
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
