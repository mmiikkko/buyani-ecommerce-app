//export const payments = mysqlTable("payments", {
  //id: varchar("id", { length: 36 }).primaryKey(),

//  orderId: varchar("order_id", { length: 36 })
//    .notNull()
//    .references(() => orders.id, { onDelete: "cascade" }),

//  paymentMethod: varchar("paymentMethod", { length: 36 }),
//  paymentReceived: decimal("paymentReceived", { precision: 10, scale: 2 }),
//  change: decimal("change", { precision: 10, scale: 2 }),
//  status: varchar("status", { length: 50 }),

//  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow(),
//  updatedAt: timestamp("updated_at", { fsp: 3 })
//    .$onUpdate(() => new Date())
//    .notNull(),
//});

export interface Payment {
    id: string;
    orderId: string;
  
    paymentMethod: string | null;
    paymentReceived: string | null; // decimal comes as string
    change: string | null;
    status: string | null;
  
    createdAt: string;
    updatedAt: string;
  }
  