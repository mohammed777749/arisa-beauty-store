// Centralized store branding constants — عدّلي هنا لتغيير الاسم/الرقم في كل المتجر

export const BRAND = {
  nameAr: "أريسا",
  nameEn: "ARISA",
  taglineAr: "صالون تجميل",
  taglineEn: "BEAUTY SALON",
  logo: "/images/logo.png",
  // Phone & WhatsApp (international format without +)
  phone: "+966550828817",
  phoneDisplay: "+966 55 082 8817",
  whatsapp: "966550828817", // for wa.me links
  email: "info@arisa-salon.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  twitter: "https://twitter.com",
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
} as const;

// WhatsApp message preset (Arabic)
export const WHATSAPP_DEFAULT_MESSAGE =
  "مرحباً أريسا 💕\nأرغب في الاستفسار عن خدماتكم ومنتجاتكم.";

// Build a WhatsApp deep link
export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${BRAND.whatsapp}?text=${text}`;
}

// Build a tel: link
export function phoneLink() {
  return `tel:${BRAND.phone}`;
}
