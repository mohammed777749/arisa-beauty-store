import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const isNew = searchParams.get("new");
    const isChoice = searchParams.get("isChoice");
    const prime = searchParams.get("prime");
    const inStock = searchParams.get("inStock");
    const search = searchParams.get("search") ?? searchParams.get("q");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const brand = searchParams.get("brand");

    const where: Prisma.ProductWhereInput = {};
    if (category) {
      where.category = { slug: category };
    }
    if (featured === "true") where.isFeatured = true;
    if (bestseller === "true") where.isBestseller = true;
    if (isNew === "true") where.isNew = true;
    if (isChoice === "true") where.isChoice = true;
    if (prime === "true") where.prime = true;
    if (inStock === "true") where.stock = { gt: 0 };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }
    if (brand) {
      const brands = brand.split(",").filter(Boolean);
      if (brands.length > 0) {
        where.brand = { in: brands };
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
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
      case "bestselling":
        orderBy = [{ isBestseller: "desc" }, { reviewCount: "desc" }];
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "relevance":
      default:
        // keep default
        break;
    }

    // Pagination
    const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 12;
    const skip = (pageNum - 1) * limitNum;
    const usePagination = !!page || !!limit;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        include: { category: true },
        ...(usePagination
          ? { take: limitNum, skip }
          : limit
          ? { take: parseInt(limit, 10) }
          : {}),
      }),
      db.product.count({ where }),
    ]);

    if (usePagination) {
      return NextResponse.json({
        products,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
