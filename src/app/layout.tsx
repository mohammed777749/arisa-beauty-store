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
    "أريسا — وجهتكِ الأولى للتجميل الفاخر في السعودية. مكياج، عناية بالبشرة، عطور، شعر، أظافر، شفاه، بالإضافة إلى خدمات تجميل احترافية: تجهيز عرايس، تكبير شفايف، فيشيز ذهبي، ليزر، سبا. شحن سريع ودفع عند الاستلام. 🌹",
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
    canonical: siteUrl,
    languages: {
      "ar-SA": siteUrl,
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
      "وجهتكِ الأولى للتجميل الفاخر في السعودية 🌹 منتجات أصلية + خدمات تجميل احترافية: تجهيز عرايس، تكبير شفايف، فيشيز ذهبي، ليزر، سبا. شحن سريع ودفع عند الاستلام. اطلبي الآن!",
    url: siteUrl,
    siteName: "أريسا",
    type: "website",
    locale: "ar_SA",
    images: [
      {
        url: `${siteUrl}/images/og-banner.jpg`,
        width: 1152,
        height: 864,
        alt: "أريسا - صالون التجميل ومتجر المستحضرات الفاخرة",
        type: "image/jpeg",
      },
      {
        url: `${siteUrl}/images/hero.jpg`,
        width: 1344,
        height: 768,
        alt: "أريسا - منتجات التجميل الفاخرة",
        type: "image/jpeg",
      },
      {
        url: `${siteUrl}/images/logo.png`,
        width: 449,
        height: 450,
        alt: "شعار أريسا",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أريسا | صالون التجميل ومتجر المستحضرات الفاخرة",
    description:
      "منتجات تجميل أصلية + خدمات تجميل احترافية: تجهيز عرايس، تكبير شفايف، فيشيز ذهبي. شحن سريع ودفع عند الاستلام. 🌹",
    images: [`${siteUrl}/images/og-banner.jpg`],
  },
  category: "shopping",
  other: {
    "theme-color": "#e11d48",
    "msapplication-TileColor": "#e11d48",
    // وسوم إضافية يفهمها واتساب وتليجرام
    "og:image:width": "1152",
    "og:image:height": "864",
    "og:image:type": "image/jpeg",
    "og:site_name": "أريسا",
    "og:locale": "ar_SA",
    "og:url": siteUrl,
    "og:type": "website",
    "twitter:image:alt": "أريسا - صالون التجميل والمستحضرات الفاخرة",
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
        {/* ===== وسوم meta إضافية لمشاركة الواتساب والسوشيال ميديا ===== */}
        <meta name="apple-mobile-web-app-title" content="أريسا" />
        <meta name="application-name" content="أريسا" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#e11d48" />
        <meta name="theme-color" content="#e11d48" />

        {/* وسوم Open Graph مباشرة (لواتساب وتليجرام) */}
        <meta property="og:site_name" content="أريسا" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:title" content="أريسا | صالون التجميل ومتجر المستحضرات الفاخرة" />
        <meta property="og:description" content="وجهتكِ الأولى للتجميل الفاخر في السعودية 🌹 منتجات أصلية + خدمات تجميل احترافية: تجهيز عرايس، تكبير شفايف، فيشيز ذهبي، ليزر، سبا. شحن سريع ودفع عند الاستلام." />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/images/og-banner.jpg`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/images/og-banner.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1152" />
        <meta property="og:image:height" content="864" />
        <meta property="og:image:alt" content="أريسا - صالون التجميل والمستحضرات الفاخرة" />

        {/* وسوم Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="أريسا | صالون التجميل ومتجر المستحضرات الفاخرة" />
        <meta name="twitter:description" content="منتجات تجميل أصلية + خدمات تجميل احترافية. شحن سريع ودفع عند الاستلام. 🌹" />
        <meta name="twitter:image" content={`${siteUrl}/images/og-banner.jpg`} />

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
