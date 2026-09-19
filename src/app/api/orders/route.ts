import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().min(0),
  image: z.string().min(1),
  quantity: z.number().int().min(1),
  shade: z.string().nullable().optional(),
});

const addressSchema = z
  .object({
    customerName: z.string().min(2, "الاسم مطلوب"),
    customerPhone: z.string().min(8, "رقم الجوال غير صحيح"),
    customerEmail: z
      .string()
      .email("بريد إلكتروني غير صحيح")
      .nullable()
      .optional()
      .or(z.literal("")),
    city: z.string().min(2, "المدينة مطلوبة"),
    address: z.string().min(5, "العنوان مطلوب"),
    notes: z.string().nullable().optional(),
  })
  .passthrough();

const orderSchema = z.object({
  address: addressSchema,
  paymentMethod: z.string().default("cod"),
  subtotal: z.number().min(0).default(0),
  shipping: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  total: z.number().min(0),
  promoCode: z.string().nullable().optional(),
  items: z.array(orderItemSchema).min(1, "السلة فارغة"),
});

function generateTrackingNumber() {
  const rnd = Math.floor(Math.random() * 9000000 + 1000000);
  return `GLM${rnd}`;
}

function buildTimeline() {
  const now = new Date();
  return JSON.stringify([
    { step: "ordered", label: "تم الطلب", at: now.toISOString(), done: true },
    { step: "processing", label: "قيد التجهيز", at: null, done: false },
    { step: "shipped", label: "تم الشحن", at: null, done: false },
    { step: "out_for_delivery", label: "خرج للتوصيل", at: null, done: false },
    { step: "delivered", label: "تم التوصيل", at: null, done: false },
  ]);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const order = await db.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(order);
    }
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Backwards-compat: accept old flat structure too
    const hasAddress = !!body.address;
    const normalized = hasAddress
      ? body
      : {
          ...body,
          address: {
            customerName: body.customerName,
            customerPhone: body.customerPhone,
            customerEmail: body.customerEmail ?? "",
            city: body.city,
            address: body.address,
            notes: body.notes ?? null,
          },
          subtotal: body.subtotal ?? body.total ?? 0,
          shipping: body.shipping ?? 0,
          discount: body.discount ?? 0,
          tax: body.tax ?? 0,
          total: body.total ?? 0,
        };

    const parsed = orderSchema.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      address,
      paymentMethod,
      items,
      subtotal,
      shipping,
      discount,
      tax,
      total,
      promoCode,
    } = parsed.data;

    // Validate stock
    const productIds = items.map((i) => i.productId);
    const existing = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true },
    });
    const stockMap = new Map(existing.map((p) => [p.id, p.stock]));
    for (const it of items) {
      if (!stockMap.has(it.productId)) {
        return NextResponse.json(
          { error: `المنتج غير موجود: ${it.name}` },
          { status: 400 }
        );
      }
    }

    const trackingNumber = generateTrackingNumber();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
    const timeline = buildTimeline();

    const order = await db.order.create({
      data: {
        customerName: address.customerName,
        customerPhone: address.customerPhone,
        customerEmail: address.customerEmail || null,
        city: address.city,
        address: address.address,
        notes: address.notes || null,
        total,
        subtotal,
        shipping,
        discount,
        tax,
        promoCode: promoCode ?? null,
        status: "processing",
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "unpaid" : "paid",
        trackingNumber,
        estimatedDelivery,
        timeline,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            name: it.name,
            price: it.price,
            image: it.image,
            quantity: it.quantity,
            shade: it.shade ?? null,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock
    for (const it of items) {
      await db.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Order id required" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const { status, advanceTimeline } = body as {
      status?: string;
      advanceTimeline?: boolean;
    };

    const order = await db.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let timeline = order.timeline;
    if (advanceTimeline && timeline) {
      try {
        const steps = JSON.parse(timeline) as Array<{
          step: string;
          label: string;
          at: string | null;
          done: boolean;
        }>;
        const nextIdx = steps.findIndex((s) => !s.done);
        if (nextIdx >= 0) {
          steps[nextIdx].done = true;
          steps[nextIdx].at = new Date().toISOString();
          timeline = JSON.stringify(steps);
          // Auto status mapping
          const newStatusByStep: Record<string, string> = {
            processing: "processing",
            shipped: "shipped",
            out_for_delivery: "out_for_delivery",
            delivered: "delivered",
          };
          const newStatus = newStatusByStep[steps[nextIdx].step];
          if (newStatus) {
            await db.order.update({
              where: { id },
              data: { timeline, status: newStatus },
            });
            return NextResponse.json({
              ...order,
              timeline,
              status: newStatus,
            });
          }
        }
      } catch {
        // ignore parse error
      }
    }

    const updated = await db.order.update({
      where: { id },
      data: { status: status ?? undefined, timeline },
      include: { items: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error patching order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
