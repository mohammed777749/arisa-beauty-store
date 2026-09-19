import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

const createCategorySchema = z.object({
  name: z.string().min(2, "اسم الفئة مطلوب"),
  nameEn: z.string().min(2, "الاسم الإنجليزي مطلوب"),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const d = parsed.data;

    // Generate a unique slug from nameEn (or name fallback)
    let slug = slugify(d.nameEn) || slugify(d.name) || `cat-${Date.now()}`;
    const existingSlug = await db.category.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const category = await db.category.create({
      data: {
        name: d.name,
        nameEn: d.nameEn,
        slug,
        description: d.description ?? null,
        image: d.image ?? null,
        icon: d.icon ?? null,
      },
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
