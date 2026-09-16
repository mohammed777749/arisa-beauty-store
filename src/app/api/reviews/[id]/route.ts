import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await db.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }
    const productId = review.productId;
    await db.review.delete({ where: { id } });

    // Recompute product rating + reviewCount
    const agg = await db.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const newRating = agg._avg.rating
      ? Math.round(agg._avg.rating * 10) / 10
      : 0;
    const newCount = agg._count.rating;
    await db.product.update({
      where: { id: productId },
      data: { rating: newRating, reviewCount: newCount },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

const updateReviewSchema = z.object({
  verified: z.boolean().optional(),
  helpful: z.number().int().min(0).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }
    const body = await request.json();
    const parsed = updateReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const updated = await db.review.update({
      where: { id },
      data: {
        verified: parsed.data.verified ?? undefined,
        helpful: parsed.data.helpful ?? undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
