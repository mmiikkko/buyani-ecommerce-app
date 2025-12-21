import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { orders, shop, user, payments, orderItems, productVariation, products } from "@/server/schema/auth-schema";
import { eq, and, sql, gte, lte } from "drizzle-orm";
import { getServerSession } from "@/server/session";
import { getWeeksInMonth, formatDateRange } from "@/lib/date-utils";

// GET /api/admin/revenue-reports - Get revenue reports with weekly breakdown
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin
        if (!session.user.role?.includes("admin")) {
            return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const sellerId = searchParams.get("sellerId"); // Optional: filter by seller
        const startDate = searchParams.get("startDate"); // Format: YYYY-MM-DD
        const endDate = searchParams.get("endDate"); // Format: YYYY-MM-DD

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: "startDate and endDate are required" },
                { status: 400 }
            );
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include entire end date

        // Calculate weeks based on the date range
        const year = start.getFullYear();
        const month = start.getMonth() + 1;
        const weeks = getWeeksInMonth(year, month);

        // Fetch all approved shops to ensure zero-sales shops are included
        const allShops = await db
            .select({
                shopId: shop.id,
                shopName: shop.shopName,
                sellerId: user.id,
                sellerName: user.name,
            })
            .from(shop)
            .innerJoin(user, eq(shop.sellerId, user.id))
            .where(eq(shop.status, "approved"));

        // Fetch all orders within the date range
        const whereConditions = [
            gte(orders.createdAt, start),
            lte(orders.createdAt, end),
        ];

        const ordersData = await db
            .select({
                orderId: orders.id,
                orderTotal: orders.total,
                orderDate: orders.createdAt,
                shopId: shop.id,
                paymentStatus: payments.status,
            })
            .from(orders)
            .leftJoin(payments, eq(orders.id, payments.orderId))
            .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
            .innerJoin(productVariation, eq(orderItems.product_variation_id, productVariation.id))
            .innerJoin(products, eq(productVariation.productId, products.id))
            .innerJoin(shop, eq(products.shopId, shop.id))
            .where(and(...whereConditions));

        // Filter only paid orders
        const paidOrders = ordersData.filter(
            (order) => order.paymentStatus === "paid" || order.paymentStatus === "completed"
        );

        // Map shops to their sales data
        const sellerMap = new Map<string, {
            sellerId: string;
            shopId: string;
            sellerName: string;
            shopName: string;
            weeklyBreakdown: Record<number, number>;
            totalSales: number;
        }>();

        // Initialize map with all shops
        for (const s of allShops) {
            if (sellerId && s.sellerId !== sellerId) continue;

            sellerMap.set(s.shopId, {
                sellerId: s.sellerId,
                shopId: s.shopId,
                sellerName: s.sellerName || "Unknown",
                shopName: s.shopName || "Unknown Shop",
                weeklyBreakdown: {},
                totalSales: 0,
            });
        }

        // Aggregate sales data
        for (const order of paidOrders) {
            const sellerData = sellerMap.get(order.shopId);
            if (!sellerData) continue;

            const orderDate = new Date(order.orderDate);

            // Determine which week this order belongs to
            let weekNumber = 1;
            for (const week of weeks) {
                if (orderDate >= week.startDate && orderDate <= week.endDate) {
                    weekNumber = week.weekNumber;
                    break;
                }
            }

            const orderTotal = Number(order.orderTotal || 0);
            sellerData.weeklyBreakdown[weekNumber] = (sellerData.weeklyBreakdown[weekNumber] || 0) + orderTotal;
            sellerData.totalSales += orderTotal;
        }

        // Total operating days in the period
        const totalOperatingDays = weeks.reduce((sum, w) => sum + w.daysCount, 0);

        // Convert map to array and calculate metrics
        const sellers = Array.from(sellerMap.values()).map((seller) => {
            const averageSalesPerDay = seller.totalSales / totalOperatingDays;

            // Calculate average sales per month
            const monthsDiff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));
            const averageSalesPerMonth = seller.totalSales / monthsDiff;

            return {
                ...seller,
                averageSalesPerDay,
                averageSalesPerMonth,
            };
        });

        // Sort by average sales and assign ranks
        sellers.sort((a, b) => b.averageSalesPerMonth - a.averageSalesPerMonth);

        const sellersWithRank = sellers.map((seller, index, arr) => {
            let rankLabel = String(index + 1);
            if (seller.totalSales > 0) {
                if (index === 0) rankLabel = "highest";
                // Find index of last shop with sales
                const lastWithSalesIndex = arr.findLastIndex(s => s.totalSales > 0);
                if (index === lastWithSalesIndex && lastWithSalesIndex !== 0) rankLabel = "lowest";
            } else {
                rankLabel = "-";
            }

            return {
                ...seller,
                rank: index + 1,
                rankLabel,
            };
        });

        // Calculate grand totals per week
        const grandTotalWeekly: Record<number, number> = {};
        let grandTotalMonthly = 0;

        for (const seller of sellersWithRank) {
            for (const [weekNum, sales] of Object.entries(seller.weeklyBreakdown)) {
                const week = Number(weekNum);
                grandTotalWeekly[week] = (grandTotalWeekly[week] || 0) + sales;
            }
            grandTotalMonthly += seller.totalSales;
        }

        // Format weekly info for frontend
        const weeksFormatted = weeks.map((week) => ({
            weekNumber: week.weekNumber,
            dateRange: formatDateRange(week.startDate, week.endDate),
            daysCount: week.daysCount,
            total: grandTotalWeekly[week.weekNumber] || 0,
        }));

        return NextResponse.json({
            reportPeriod: {
                startDate: startDate,
                endDate: endDate,
                totalOperatingDays,
            },
            weeks: weeksFormatted,
            sellers: sellersWithRank,
            grandTotalWeekly,
            grandTotalMonthly,
            totalSellers: sellersWithRank.length,
        });
    } catch (error) {
        console.error("Error fetching revenue reports:", error);
        return NextResponse.json(
            { error: "Failed to fetch revenue reports" },
            { status: 500 }
        );
    }
}
