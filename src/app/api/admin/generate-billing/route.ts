import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { shop, tenantBilling, tenantPayments } from "@/server/schema/auth-schema";
import { eq, isNull } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// POST /api/admin/generate-billing - Generate billing records for approved shops
export async function POST(req: NextRequest) {
    try {
        // Get all approved shops that don't have billing records yet
        const approvedShops = await db
            .select({
                id: shop.id,
                sellerId: shop.sellerId,
                shopName: shop.shopName,
                createdAt: shop.createdAt,
            })
            .from(shop)
            .where(eq(shop.status, "approved"));

        if (approvedShops.length === 0) {
            return NextResponse.json({ message: "No approved shops found" });
        }

        const results = [];
        const monthlyRent = 500; // Default monthly rent amount

        for (const shopData of approvedShops) {
            // Check if billing records already exist
            const existingBilling = await db
                .select()
                .from(tenantBilling)
                .where(eq(tenantBilling.tenantId, shopData.sellerId))
                .limit(1);

            if (existingBilling.length > 0) {
                results.push({
                    shop: shopData.shopName,
                    status: "skipped",
                    reason: "Billing records already exist",
                });
                continue;
            }

            const shopCreatedDate = new Date(shopData.createdAt);
            const firstMonth = `${shopCreatedDate.getFullYear()}-${String(shopCreatedDate.getMonth() + 1).padStart(2, "0")}`;

            // Calculate second month
            const secondMonthDate = new Date(shopCreatedDate);
            secondMonthDate.setMonth(secondMonthDate.getMonth() + 1);
            const secondMonth = `${secondMonthDate.getFullYear()}-${String(secondMonthDate.getMonth() + 1).padStart(2, "0")}`;

            // Create first billing record (already paid)
            const firstBillingId = uuidv4();
            await db.insert(tenantBilling).values({
                id: firstBillingId,
                tenantId: shopData.sellerId,
                billingMonth: firstMonth,
                amountDue: String(monthlyRent),
                dueDate: shopCreatedDate,
                status: "paid",
            });

            // Create payment record for first month
            await db.insert(tenantPayments).values({
                id: uuidv4(),
                billingId: firstBillingId,
                tenantId: shopData.sellerId,
                receiptNumber: `INIT-${shopData.id.substring(0, 8).toUpperCase()}`,
                amountPaid: String(monthlyRent),
                receiptUrl: "https://placeholder.com/initial-payment",
                paymentDate: shopCreatedDate,
                verificationStatus: "verified",
            });

            // Create second billing record (pending)
            await db.insert(tenantBilling).values({
                id: uuidv4(),
                tenantId: shopData.sellerId,
                billingMonth: secondMonth,
                amountDue: String(monthlyRent),
                dueDate: secondMonthDate,
                status: "pending",
            });

            results.push({
                shop: shopData.shopName,
                status: "created",
                firstMonth,
                secondMonth,
            });
        }

        return NextResponse.json({
            message: "Billing records generated successfully",
            processed: results.length,
            results,
        });
    } catch (error) {
        console.error("Error generating billing records:", error);
        return NextResponse.json(
            { error: "Failed to generate billing records" },
            { status: 500 }
        );
    }
}
