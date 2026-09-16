import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

const updateProductSchema = z.object({
  name: z.string().min(2, "اسم المنتج مطلوب"),
  description: z.string().min(5, "الوصف مطلوب"),
  price: z.number().min(0, "السعر مطلوب"),
  oldPrice: z.number().min(0).nullable().optional(),
  image: z.string().min(1, "الصورة مطلوبة"),
  images: z.array(z.string()).optional(),
  categoryId: z.string().min(1, "الفئة مطلوبة"),
  stock: z.number().int().min(0).default(0),
  brand: z.string().default("جلورية"),
  shades: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isChoice: z.boolean().default(false),
  prime: z.boolean().default(true),
  ingredients: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  origin: z.string().nullable().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const d = parsed.data;

    const cat = await db.category.findUnique({ where: { id: d.categoryId } });
    if (!cat) {
      return NextResponse.json(
        { error: "الفئة غير موجودة" },
        { status: 400 }
      );
    }

    const imagesArr = d.images && d.images.length > 0 ? d.images : [d.image];
    const shadesArr = d.shades && d.shades.length > 0 ? d.shades : null;

    const updated = await db.product.update({
      where: { id },
      data: {
        name: d.name,
        description: d.description,
        price: d.price,
        oldPrice: d.oldPrice ?? null,
        image: d.image,
        images: JSON.stringify(imagesArr),
        categoryId: d.categoryId,
        stock: d.stock,
        brand: d.brand,
        shades: shadesArr ? JSON.stringify(shadesArr) : null,
        isFeatured: d.isFeatured,
        isBestseller: d.isBestseller,
        isNew: d.isNew,
        isChoice: d.isChoice,
        prime: d.prime,
        ingredients: d.ingredients ?? null,
        weight: d.weight ?? null,
        origin: d.origin ?? null,
      },
      include: { category: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    // Reviews cascade-delete via schema (onDelete: Cascade).
    // OrderItems reference product — block deletion if any order items exist.
    const orderItemsCount = await db.orderItem.count({ where: { productId: id } });
    if (orderItemsCount > 0) {
      return NextResponse.json(
        {
          error:
            "لا يمكن حذف المنتج لوجود طلبات مرتبطة به. يمكنك تصفير المخزون بدلاً من ذلك.",
        },
        { status: 400 }
      );
    }
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
