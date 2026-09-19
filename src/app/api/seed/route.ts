import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  categories,
  products,
  services,
  generateReviews,
  reviewCountForProduct,
} from "@/lib/seed-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function daysAgoDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/**
 * يهيّئ قاعدة البيانات فقط إذا كانت فارغة (لا يوجد فئات).
 * آمن للتشغيل المتكرر — لا يفعل شيئاً إذا كانت البيانات موجودة.
 * يُستدعى تلقائياً من middleware عند أول زيارة لقاعدة فارغة.
 */
export async function GET() {
  try {
    // تحقق هل البيانات موجودة بالفعل؟
    const existingCount = await db.category.count();
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: "قاعدة البيانات مهيّأة بالفعل",
        alreadySeeded: true,
        categories: existingCount,
      });
    }

    // قاعدة البيانات فارغة — هذّي البيانات
    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: "تمت التهيئة التلقائية لقاعدة البيانات",
      alreadySeeded: false,
      ...result,
    });
  } catch (error) {
    console.error("Auto-seed error:", error);
    return NextResponse.json(
      { error: "Failed to auto-seed", details: String(error) },
      { status: 500 }
    );
  }
}

async function seedDatabase() {
  // امسحي أي بيانات جزئية أولاً
  await db.serviceBooking.deleteMany();
  await db.service.deleteMany();
  await db.review.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  // أدخلي الفئات
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const created = await db.category.create({
      data: {
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn,
        description: c.description,
        image: c.image,
        icon: c.icon,
      },
    });
    categoryMap.set(c.slug, created.id);
  }

  // أدخلي المنتجات + المراجعات
  let reviewTotal = 0;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) continue;
    const created = await db.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        image: p.image,
        images: JSON.stringify(p.images),
        categoryId,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        brand: p.brand,
        shades: p.shades ? JSON.stringify(p.shades) : null,
        isFeatured: p.isFeatured ?? false,
        isBestseller: p.isBestseller ?? false,
        isNew: p.isNew ?? false,
        isChoice: p.isChoice ?? false,
        prime: p.prime ?? true,
        ingredients: p.ingredients ?? null,
        weight: p.weight ?? null,
        origin: p.origin ?? null,
      },
    });

    const count = reviewCountForProduct(i);
    const reviews = generateReviews(i, count);
    for (const r of reviews) {
      await db.review.create({
        data: {
          productId: created.id,
          author: r.author,
          rating: r.rating,
          title: r.title,
          body: r.body,
          helpful: r.helpful,
          verified: r.verified,
          createdAt: daysAgoDate(r.daysAgo),
        },
      });
      reviewTotal++;
    }
  }

  // أدخلي الخدمات
  for (const s of services) {
    await db.service.create({
      data: {
        name: s.name,
        description: s.description,
        price: s.price,
        oldPrice: s.oldPrice ?? null,
        duration: s.duration,
        image: s.image,
        category: s.category,
        icon: s.icon,
        isFeatured: s.isFeatured ?? false,
        isPopular: s.isPopular ?? false,
        isActive: s.isActive ?? true,
        rating: s.rating,
        reviewCount: s.reviewCount,
        whatIncluded: s.whatIncluded ? JSON.stringify(s.whatIncluded) : null,
      },
    });
  }

  return {
    categories: categories.length,
    products: products.length,
    reviews: reviewTotal,
    services: services.length,
  };
}
