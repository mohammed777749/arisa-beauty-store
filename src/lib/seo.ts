// JSON-LD structured data for SEO — يساعد Google على فهم المتجر
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "أريسا",
  alternateName: "ARISA Beauty Salon",
  description:
    "صالون تجميل ومتجر مستحضرات فاخرة في السعودية. مكياج، عناية بالبشرة، عطور، خدمات تجميل احترافية وتجهيز عرايس.",
  image: "https://arisa-beauty-store.vercel.app/images/logo.png",
  logo: "https://arisa-beauty-store.vercel.app/images/logo.png",
  url: "https://arisa-beauty-store.vercel.app",
  telephone: "+966550828817",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SA",
    addressRegion: "الرياض",
    addressLocality: "الرياض",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 24.7136,
    longitude: 46.6753,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "10:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Friday",
      opens: "16:00",
      closes: "22:00",
    },
  ],
  sameAs: [
    "https://instagram.com",
    "https://twitter.com",
    "https://facebook.com",
  ],
  makesOffer: [
    { "@type": "Offer", name: "تجهيز العرايس", price: "2500", priceCurrency: "SAR" },
    { "@type": "Offer", name: "تكبير الشفايف", price: "800", priceCurrency: "SAR" },
    { "@type": "Offer", name: "فيليش ذهبي", price: "450", priceCurrency: "SAR" },
    { "@type": "Offer", name: "إزالة الشعر بالليزر", price: "600", priceCurrency: "SAR" },
    { "@type": "Offer", name: "حمام مغربي", price: "250", priceCurrency: "SAR" },
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "أريسا",
  url: "https://arisa-beauty-store.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://arisa-beauty-store.vercel.app/?view=search&q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "أريسا - متجر التجميل",
  description:
    "متجر إلكتروني لبيع مستحضرات التجميل الفاخرة: مكياج، عطور، عناية بالبشرة، شعر، أظافر.",
  url: "https://arisa-beauty-store.vercel.app",
  telephone: "+966550828817",
  paymentAccepted: "Cash, Credit Card, Mada, Apple Pay",
  currenciesAccepted: "SAR",
};
