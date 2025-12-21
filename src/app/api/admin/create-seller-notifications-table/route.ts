import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/drizzle";
import { sql } from "drizzle-orm";

// GET /api/admin/create-seller-notifications-table
// This allows the user to just visit the URL in the browser to fix the DB
export async function GET(req: NextRequest) {
    try {
        console.log("Migration: Creating seller_notifications table if it doesn't exist...");

        // Using a multi-statement approach or separate executes if needed, but MySQL allows IF NOT EXISTS
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS seller_notifications (
                id varchar(36) NOT NULL,
                seller_id varchar(36) NOT NULL,
                billing_id varchar(36) DEFAULT NULL,
                title varchar(255) NOT NULL,
                message text NOT NULL,
                type varchar(50) NOT NULL DEFAULT 'payment_reminder',
                is_read tinyint(1) NOT NULL DEFAULT 0,
                sent_by varchar(36) DEFAULT NULL,
                created_at timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                read_at timestamp(3) DEFAULT NULL,
                PRIMARY KEY (id),
                KEY seller_id (seller_id),
                KEY billing_id (billing_id),
                KEY sent_by (sent_by),
                CONSTRAINT seller_notifications_seller_id_fk FOREIGN KEY (seller_id) REFERENCES user(id) ON DELETE CASCADE,
                CONSTRAINT seller_notifications_billing_id_fk FOREIGN KEY (billing_id) REFERENCES tenant_billing(id) ON DELETE SET NULL,
                CONSTRAINT seller_notifications_sent_by_fk FOREIGN KEY (sent_by) REFERENCES user(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        return NextResponse.json({
            success: true,
            message: "Table 'seller_notifications' verified/created successfully.",
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Migration Error:", error);
        return NextResponse.json(
            {
                error: "Failed to create table",
                details: error?.message || "Unknown error",
                sqlState: error?.sqlState,
                code: error?.code
            },
            { status: 500 }
        );
    }
}

// Keep POST for compatibility if needed
export async function POST(req: NextRequest) {
    return GET(req);
}
