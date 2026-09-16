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

const orderSchema = z.object({
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
  paymentMethod: z.string().default("cod"),
  items: z.array(orderItemSchema).min(1, "السلة فارغة"),
});

export async function GET() {
  try {
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
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, paymentMethod, ...customer } = parsed.data;
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

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

    const order = await db.order.create({
      data: {
        ...customer,
        customerEmail: customer.customerEmail || null,
        notes: customer.notes || null,
        total,
        status: "pending",
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

    for (const it of items) {
      await db.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    return NextResponse.json({ ...order, paymentMethod }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
