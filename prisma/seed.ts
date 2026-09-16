import { db } from "../src/lib/db";
import { categories, products } from "../src/lib/seed-data";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clean existing data (idempotent)
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  // Insert categories
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
    console.log(`  ✓ Category: ${c.name}`);
  }

  // Insert products
  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      throw new Error(`Category not found for slug: ${p.categorySlug}`);
    }
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
  console.log(`  ✓ ${products.length} products inserted`);

  console.log("✅ Seeding complete!");
  await db.$disconnect();
}

seed().catch((e) => {
  console.error("❌ Seed error:", e);
  db.$disconnect();
  process.exit(1);
});
