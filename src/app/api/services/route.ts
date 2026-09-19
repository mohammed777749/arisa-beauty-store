import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createServiceSchema = z.object({
  name: z.string().min(2, "اسم الخدمة مطلوب"),
  description: z.string().min(5, "الوصف مطلوب"),
  price: z.number().min(0, "السعر مطلوب"),
  oldPrice: z.number().min(0).nullable().optional(),
  duration: z.number().int().min(5, "المدة مطلوبة"),
  image: z.string().min(1, "الصورة مطلوبة"),
  category: z.string().min(1, "الفئة مطلوبة"),
  icon: z.string().default("Sparkles"),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  rating: z.number().min(0).max(5).default(5),
  reviewCount: z.number().int().min(0).default(0),
  whatIncluded: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createServiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const service = await db.service.create({
      data: {
        name: d.name,
        description: d.description,
        price: d.price,
        oldPrice: d.oldPrice ?? null,
        duration: d.duration,
        image: d.image,
        category: d.category,
        icon: d.icon,
        isFeatured: d.isFeatured,
        isPopular: d.isPopular,
        isActive: d.isActive,
        rating: d.rating,
        reviewCount: d.reviewCount,
        whatIncluded: d.whatIncluded && d.whatIncluded.length > 0 ? JSON.stringify(d.whatIncluded) : null,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const popular = searchParams.get("popular");
    const search = searchParams.get("search") ?? searchParams.get("q");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit");

    const where: Prisma.ServiceWhereInput = { isActive: true };
    if (category) where.category = category;
    if (featured === "true") where.isFeatured = true;
    if (popular === "true") where.isPopular = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let orderBy: Prisma.ServiceOrderByWithRelationInput = { createdAt: "desc" };
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
    }

    const take = limit ? Math.max(1, parseInt(limit, 10)) : undefined;
    const services = await db.service.findMany({
      where,
      orderBy,
      ...(take ? { take } : {}),
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
