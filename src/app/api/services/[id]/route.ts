import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  price: z.number().min(0).optional(),
  oldPrice: z.number().min(0).nullable().optional(),
  duration: z.number().int().min(5).optional(),
  image: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  icon: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  whatIncluded: z.array(z.string()).nullable().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await db.service.findUnique({
      where: { id },
    });
    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }
    const body = await request.json();
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const updated = await db.service.update({
      where: { id },
      data: {
        ...(d.name !== undefined ? { name: d.name } : {}),
        ...(d.description !== undefined ? { description: d.description } : {}),
        ...(d.price !== undefined ? { price: d.price } : {}),
        ...(d.oldPrice !== undefined ? { oldPrice: d.oldPrice ?? null } : {}),
        ...(d.duration !== undefined ? { duration: d.duration } : {}),
        ...(d.image !== undefined ? { image: d.image } : {}),
        ...(d.category !== undefined ? { category: d.category } : {}),
        ...(d.icon !== undefined ? { icon: d.icon } : {}),
        ...(d.isFeatured !== undefined ? { isFeatured: d.isFeatured } : {}),
        ...(d.isPopular !== undefined ? { isPopular: d.isPopular } : {}),
        ...(d.isActive !== undefined ? { isActive: d.isActive } : {}),
        ...(d.rating !== undefined ? { rating: d.rating } : {}),
        ...(d.reviewCount !== undefined ? { reviewCount: d.reviewCount } : {}),
        ...(d.whatIncluded !== undefined
          ? { whatIncluded: d.whatIncluded && d.whatIncluded.length > 0 ? JSON.stringify(d.whatIncluded) : null }
          : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }
    // Block deletion if bookings exist; soft delete instead
    const bookingsCount = await db.serviceBooking.count({ where: { serviceId: id } });
    if (bookingsCount > 0) {
      await db.service.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, softDeleted: true });
    }
    await db.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
