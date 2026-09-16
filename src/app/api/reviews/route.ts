import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort") ?? "newest";

    if (!productId) {
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );
    }

    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (sort === "helpful") orderBy = { helpful: "desc" };
    else if (sort === "rating_high") orderBy = { rating: "desc" };
    else if (sort === "rating_low") orderBy = { rating: "asc" };

    const reviews = await db.review.findMany({
      where: { productId },
      orderBy,
      take: limit ? parseInt(limit, 10) : undefined,
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

const createSchema = z.object({
  productId: z.string().min(1),
  author: z.string().min(2, "الاسم مطلوب"),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, "العنوان مطلوب"),
  body: z.string().min(5, "نص التقييم قصير جداً"),
});

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = createSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { productId, author, rating, title, body } = parsed.data;

    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const review = await db.review.create({
      data: { productId, author, rating, title, body, helpful: 0, verified: true },
    });

    // Recompute product rating + reviewCount
    const agg = await db.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const newRating = agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : product.rating;
    const newCount = agg._count.rating;
    await db.product.update({
      where: { id: productId },
      data: { rating: newRating, reviewCount: newCount },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
