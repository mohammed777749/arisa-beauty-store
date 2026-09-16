import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalReviews,
      pendingOrders,
      lowStockProducts,
      orders,
      reviewsAgg,
      recentOrdersRaw,
      topProductsRaw,
    ] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.order.count(),
      db.review.count(),
      db.order.count({ where: { status: { in: ["pending", "processing"] } } }),
      db.product.count({ where: { stock: { lt: 10 } } }),
      db.order.findMany({ select: { total: true, status: true, createdAt: true } }),
      db.review.aggregate({ _avg: { rating: true }, _count: { rating: true } }),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
      db.product.findMany({
        orderBy: { reviewCount: "desc" },
        take: 5,
        include: { category: true },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgRating = reviewsAgg._avg.rating
      ? Math.round(reviewsAgg._avg.rating * 10) / 10
      : 0;

    // Orders by status
    const ordersByStatus: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const o of orders) {
      const s = (o.status || "pending") as string;
      if (s in ordersByStatus) ordersByStatus[s] += 1;
      else ordersByStatus[s] = (ordersByStatus[s] || 0) + 1;
    }

    // Revenue by day (last 7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const revenueByDay: { date: string; label: string; revenue: number }[] = [];
    const dayLabels = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const rev = orders
        .filter((o) => {
          const od = new Date(o.createdAt);
          return od >= d && od < next;
        })
        .reduce((s, o) => s + (o.total || 0), 0);
      revenueByDay.push({
        date: d.toISOString().slice(0, 10),
        label: dayLabels[d.getDay()],
        revenue: Math.round(rev),
      });
    }

    // Low stock list (top 10)
    const lowStockList = await db.product.findMany({
      where: { stock: { lt: 10 } },
      take: 10,
      orderBy: { stock: "asc" },
      include: { category: true },
    });

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      pendingOrders,
      lowStockProducts,
      totalReviews,
      avgRating,
      ordersByStatus,
      revenueByDay,
      recentOrders: recentOrdersRaw,
      topProducts: topProductsRaw,
      lowStockList,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
