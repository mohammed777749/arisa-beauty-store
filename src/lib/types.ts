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
  createdAt: string;
};

export function parseProduct(p: Product) {
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

export function formatPrice(value: number) {
  return new Intl.NumberFormat("ar-SA", {
    maximumFractionDigits: 0,
  }).format(value);
}

export const CURRENCY = "ر.س";
