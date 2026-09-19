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

export async function GET() {
  try {
    await db.serviceBooking.deleteMany();
    await db.service.deleteMany();
    await db.review.deleteMany();
    await db.orderItem.deleteMany();
    await db.order.deleteMany();
    await db.product.deleteMany();
    await db.category.deleteMany();

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

      // Seed reviews for this product
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

    // Insert services
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
          isActive: true,
          rating: s.rating,
          reviewCount: s.reviewCount,
          whatIncluded: JSON.stringify(s.whatIncluded),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${categories.length} categories, ${products.length} products, ${reviewTotal} reviews, and ${services.length} services`,
      categories: categories.length,
      products: products.length,
      reviews: reviewTotal,
      services: services.length,
    });
  } catch (error) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
