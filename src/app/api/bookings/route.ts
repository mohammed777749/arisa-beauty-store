import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createBookingSchema = z.object({
  serviceId: z.string().min(1, "الخدمة مطلوبة"),
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z.string().min(8, "رقم الجوال غير صحيح"),
  customerEmail: z
    .string()
    .email("بريد إلكتروني غير صحيح")
    .nullable()
    .optional()
    .or(z.literal("")),
  preferredDate: z.string().min(8, "التاريخ مطلوب"),
  preferredTime: z.string().min(3, "الوقت مطلوب"),
  notes: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const booking = await db.serviceBooking.findUnique({
        where: { id },
        include: { service: true },
      });
      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(booking);
    }
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");
    const where: { customerPhone?: string; customerEmail?: string } = {};
    if (phone) where.customerPhone = phone;
    if (email) where.customerEmail = email;
    const hasFilter = phone || email;
    const bookings = await db.serviceBooking.findMany({
      where: hasFilter ? where : {},
      orderBy: { createdAt: "desc" },
      include: { service: true },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const service = await db.service.findUnique({ where: { id: d.serviceId } });
    if (!service) {
      return NextResponse.json(
        { error: "الخدمة غير موجودة" },
        { status: 400 }
      );
    }
    const booking = await db.serviceBooking.create({
      data: {
        serviceId: d.serviceId,
        customerName: d.customerName.trim(),
        customerPhone: d.customerPhone.trim(),
        customerEmail: d.customerEmail && d.customerEmail.trim() !== "" ? d.customerEmail.trim() : null,
        preferredDate: d.preferredDate,
        preferredTime: d.preferredTime,
        notes: d.notes && d.notes.trim() !== "" ? d.notes.trim() : null,
        status: "pending",
        totalPrice: service.price,
      },
      include: { service: true },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

const updateBookingSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "completed", "cancelled"])
    .optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Booking id required" },
        { status: 400 }
      );
    }
    const existing = await db.serviceBooking.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    const body = await request.json();
    const parsed = updateBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const updated = await db.serviceBooking.update({
      where: { id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
      },
      include: { service: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error patching booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
