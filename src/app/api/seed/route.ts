import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    for (const p of products) {
      const categoryId = categoryMap.get(p.categorySlug);
      if (!categoryId) continue;
      await db.product.create({
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
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${categories.length} categories and ${products.length} products`,
      categories: categories.length,
      products: products.length,
    });
  } catch (error) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
