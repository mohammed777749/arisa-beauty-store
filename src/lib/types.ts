// Shared types used across frontend + API.

export type Category = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  createdAt: string;
};

export type CategoryWithCount = Category & {
  _count?: { products: number };
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  image: string;
  images: string; // JSON string
  categoryId: string;
  category?: Category;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  shades: string | null; // JSON string
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  // Amazon-style enhancements
  isChoice?: boolean;
  prime?: boolean;
  ingredients?: string | null;
  weight?: string | null;
  origin?: string | null;
  reviews?: Review[];
  createdAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  shade?: string | null;
};

export type OrderTimelineStep = {
  step: string;
  label: string;
  at: string | null;
  done: boolean;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  city: string;
  address: string;
  notes?: string | null;
  total: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  timeline?: string | null;
  subtotal?: number;
  shipping?: number;
  discount?: number;
  tax?: number;
  promoCode?: string | null;
  items?: OrderItem[];
  createdAt: string;
};

export function parseProduct<T extends Product>(p: T) {
  let images: string[] = [];
  try {
    images = JSON.parse(p.images) as string[];
  } catch {
    images = [p.image];
  }
  let shades: string[] | null = null;
  if (p.shades) {
    try {
      shades = JSON.parse(p.shades) as string[];
    } catch {
      shades = null;
    }
  }
  return {
    ...p,
    images: images.length ? images : [p.image],
    shades,
  };
}

export function parseOrderTimeline(timeline: string | null | undefined): OrderTimelineStep[] {
  if (!timeline) return [];
  try {
    return JSON.parse(timeline) as OrderTimelineStep[];
  } catch {
    return [];
  }
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("ar-SA", {
    maximumFractionDigits: 0,
  }).format(value);
}

export const CURRENCY = "ر.س";

// Promo codes
export const PROMO_CODES: Record<string, number> = {
  GLAM25: 0.25,
  WELCOME10: 0.1,
};

export function getPromoDiscount(code: string): number | null {
  const k = code.trim().toUpperCase();
  return PROMO_CODES[k] ?? null;
}

// Order status helpers (Arabic labels + colors)
export const ORDER_STATUS: Record<
  string,
  { label: string; color: string; step: number }
> = {
  pending: { label: "قيد المعالجة", color: "amber", step: 1 },
  processing: { label: "قيد المعالجة", color: "amber", step: 1 },
  shipped: { label: "تم الشحن", color: "teal", step: 2 },
  out_for_delivery: { label: "خرج للتوصيل", color: "teal", step: 3 },
  delivered: { label: "تم التوصيل", color: "green", step: 4 },
  cancelled: { label: "ملغي", color: "rose", step: 0 },
};

// ===== Beauty services (Task ID: 10) =====

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  duration: number;
  image: string;
  category: string;
  icon: string;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  whatIncluded: string | null; // JSON string array
  createdAt: string;
};

export type ServiceBooking = {
  id: string;
  serviceId: string;
  service?: Service;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  preferredDate: string;
  preferredTime: string;
  notes?: string | null;
  status: string;
  totalPrice: number;
  createdAt: string;
};

export type ServiceCategory = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  count?: number;
};

export function parseService<T extends Service>(s: T) {
  let whatIncluded: string[] = [];
  if (s.whatIncluded) {
    try {
      whatIncluded = JSON.parse(s.whatIncluded) as string[];
    } catch {
      whatIncluded = [];
    }
  }
  return { ...s, whatIncluded: whatIncluded };
}

// Booking status helpers (Arabic labels + colors)
export const BOOKING_STATUS: Record<
  string,
  { label: string; color: string }
> = {
  pending: { label: "قيد الانتظار", color: "amber" },
  confirmed: { label: "مؤكد", color: "teal" },
  completed: { label: "مكتمل", color: "green" },
  cancelled: { label: "ملغي", color: "rose" },
};

// Convert minutes → Arabic humanized duration (e.g. "ساعتين و٤٠ دقيقة")
export function formatDurationAr(minutes: number): string {
  if (minutes <= 0) return "—";
  const arabicDigits = (n: number) =>
    n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d, 10)]);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const parts: string[] = [];
  if (h > 0) {
    if (h === 1) parts.push("ساعة");
    else if (h === 2) parts.push("ساعتين");
    else if (h >= 3 && h <= 10) parts.push(`${arabicDigits(h)} ساعات`);
    else parts.push(`${arabicDigits(h)} ساعة`);
  }
  if (m > 0) {
    parts.push(`${arabicDigits(m)} دقيقة`);
  }
  return parts.join(" و");
}
