import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceCategories } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Count active services per category
    const rows = await db.service.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: { _all: true },
    });
    const countMap = new Map<string, number>();
    for (const r of rows) {
      countMap.set(r.category, r._count._all);
    }
    const total = Array.from(countMap.values()).reduce((s, n) => s + n, 0);
    const data = serviceCategories.map((c) => ({
      ...c,
      count: countMap.get(c.slug) ?? 0,
    }));
    return NextResponse.json({ categories: data, total });
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch service categories" },
      { status: 500 }
    );
  }
}
