import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  int,
  unique,
  longtext,
} from "drizzle-orm/mysql-core";



export const USER_ROLES = {
  ADMIN: "admin",
  SELLER: "seller",
  CUSTOMER: "customer",
  PENDING_SELLER: "pending_seller",
  SUSPENDED: "suspended",
};

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(), // username
  first_name: text("first_name"),
  last_name: text("last_name"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: varchar("role", { length: 50 }).default(USER_ROLES.CUSTOMER).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const addresses = mysqlTable("addresses", {
  id: varchar("id", { length: 36 }).primaryKey(),

  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  receipientName: varchar("receipient_name", { length: 255 }).notNull(),
  street: varchar("street", { length: 255 }),
  baranggay: varchar("baranggay", { length: 255 }),
  city: varchar("city", { length: 255 }),
  province: varchar("province", { length: 255 }),
  region: varchar("region", { length: 255 }),
  zipcode: varchar("zipcode", { length: 20 }),
  remarks: text("remarks"),

  addedAt: timestamp("added_at", { fsp: 3 }).defaultNow().notNull(),
  modifiedAt: timestamp("modified_at", { fsp: 3 }).defaultNow().notNull(),
  //.$onUpdate(() => new Date())
});

export const shop = mysqlTable("shop", {
  id: varchar("id", { length: 36 }).primaryKey(),

  sellerId: varchar("seller_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  shopName: varchar("shop_name", { length: 255 }).unique().notNull(),
  imageURL: longtext("image"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  shopRating: varchar("shop_rating", { length: 10 }),
  description: text("description"),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 36 }).primaryKey(),
  categoryName: varchar("category_name", { length: 255 }).notNull().unique(),
});


export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).primaryKey(),

  shopId: varchar("shop_id", { length: 36 })
    .notNull()
    .references(() => shop.id, { onDelete: "cascade" }),

  categoryId: varchar("category_id", { length: 36 })
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),

  productName: varchar("product_name", { length: 255 }).notNull(),
  description: text("description"),
  rating: int("rating"),

  isAvailable: boolean("is_available").default(true),
  status: varchar("status", { length: 50 }).default("Available"),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const productVariation = mysqlTable("product_variation", {
  id: varchar("id", { length: 36 }).primaryKey(),

  productId: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  variationName: varchar("variation_name", { length: 100 }).notNull(),
  variationType: varchar("variation_type", { length: 100 }).notNull(),
  variationValue: varchar("variation_value", { length: 100 }).notNull(),

  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  SKU: varchar("sku", { length: 255 }).unique(),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const productInventory = mysqlTable("product_inventory", {
  id: varchar("id", { length: 36 }).primaryKey(),

  product_variation_id: varchar("product_variation_id", { length: 36 })
    .notNull()
    .references(() => productVariation.id, { onDelete: "cascade" }),

  quantityInStock: int("quantity_in_stock"),
  itemsSold: int("items_sold"),
  restockLevel: varchar("restock_level", { length: 50 }),
  restockDate: timestamp("restock_date", { fsp: 3 }),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).$onUpdate(() => new Date()),
});

export const productImages = mysqlTable("product_images", {
  id: varchar("id", { length: 36 }).primaryKey(),
  productId: varchar("product_id", { length: 36 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: longtext("url"),
});

export const productVariationImages = mysqlTable("product_variation_images", {
  id: varchar("id", { length: 36 }).primaryKey(),
  variationId: varchar("variation_id", { length: 36 })
    .notNull()
    .references(() => productVariation.id, { onDelete: "cascade" }),
  url: longtext("url"),
});


export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),

  buyerId: varchar("buyer_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  addressId: varchar("address_id", { length: 36 })
    .references(() => addresses.id, { onDelete: "set null" }),

  total: decimal("total", { precision: 10, scale: 2 }),
  orderType: varchar("order_type", { length: 50 }).default("online"),
  customerName: varchar("customer_name", { length: 255 }),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const orderItems = mysqlTable(
  "order_items",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    orderId: varchar("order_id", { length: 36 })
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    product_variation_id: varchar("product_variation_id", { length: 36 })
      .notNull()
      .references(() => productVariation.id, { onDelete: "cascade" }),

    quantity: int("quantity").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  },

  //(table) => ({
  //Prevent duplicate product rows in the same order
  //orderProductUnique: unique("order_product_unique").on(
  //table.orderId,
  //table.productVariationId
  //),
  //})
);

export const shippingInfo = mysqlTable("shipping_info", {
  id: varchar("id", { length: 36 }).primaryKey(),

  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 50 }),
  trackingInfo: varchar("tracking_info", { length: 255 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }),
  weight: decimal("weight_l", { precision: 10, scale: 2 }),
  height: decimal("height", { precision: 10, scale: 2 }),
  width: decimal("width", { precision: 10, scale: 2 }),
  length: decimal("length", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});


export const payments = mysqlTable("payments", {
  id: varchar("id", { length: 36 }).primaryKey(),

  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  paymentMethod: varchar("paymentMethod", { length: 36 }),
  paymentReceived: decimal("paymentReceived", { precision: 10, scale: 2 }),
  change: decimal("change", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: varchar("id", { length: 36 }).primaryKey(),

  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  transactionType: varchar("transaction_type", { length: 50 }),
  remarks: text("remarks"),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date()),
});

export const carts = mysqlTable("carts", {
  id: varchar("id", { length: 36 }).primaryKey(),

  buyerId: varchar("buyer_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  modifiedAt: timestamp("modified_at", { fsp: 3 }).defaultNow().notNull(),
  //.$onUpdate(() => new Date()),
},
  //(table) => ({
  //buyerUnique: unique("buyer_unique").on(table.buyerId),
  //})
);


export const cartItems = mysqlTable(
  "cart_items",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    cartId: varchar("cart_id", { length: 36 })
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),

    productVariationId: varchar("product_variation_id", { length: 36 })
      .notNull()
      .references(() => productVariation.id, { onDelete: "cascade" }),

    quantity: int("quantity").notNull().default(1),

    addedAt: timestamp("added_at", { fsp: 3 }).defaultNow().notNull(),
    modifiedAt: timestamp("modified_at", { fsp: 3 }).$onUpdate(() => new Date()),
  },

  //(table) => ({
  // Prevents duplicate products in the same cart
  //uniqueCartItem: unique("unique_cart_item").on(
  //table.cartId,
  //table.productVariationId
  //),
  //})
);

export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 36 }).primaryKey(),

  orderId: varchar("order_id", { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  buyerId: varchar("buyer_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  comment: varchar("comment", { length: 355 }),
  rating: int("rating"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date()),
},
  //(table) => ({
  //reviewUnique: unique("review_unique").on(table.orderId, table.buyerId),
  //})
);

export const conversations = mysqlTable("conversations", {
  id: varchar("id", { length: 36 }).primaryKey(),

  customerId: varchar("customer_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  sellerId: varchar("seller_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  productId: varchar("product_id", { length: 36 })
    .references(() => products.id, { onDelete: "set null" }),

  lastMessageAt: timestamp("last_message_at", { fsp: 3 }).defaultNow(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
},
  //(table) => ({
  //uniqueConversation: unique("unique_conversation").on(
  //table.customerId,
  //table.sellerId,
  //table.productId
  //),
  //})
);

export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey(),

  conversationId: varchar("conversation_id", { length: 36 })
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),

  senderId: varchar("sender_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const carouselImages = mysqlTable("carousel_images", {
  id: varchar("id", { length: 36 }).primaryKey(),
  imageDescription: text("image_description"),
  imageURL: longtext("image_url"),
  addedAt: timestamp("added_at", { fsp: 3 }).defaultNow().notNull(),
})

export const passwordResetCodes = mysqlTable("password_reset_codes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
});

export const buyaniRatings = mysqlTable("buyani_ratings", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: int("rating"),
  review: text("review"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).defaultNow()
})

export const tenantBilling = mysqlTable("tenant_billing", {
  id: varchar("id", { length: 36 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  billingMonth: varchar("billing_month", { length: 20 }).notNull(),
  amountDue: decimal("amount_due", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date", { fsp: 3 }).notNull(),
  status: varchar("status", { length: 50 }).default("unpaid").notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).defaultNow()
})

export const tenantPayments = mysqlTable("tenant_payments", {
  id: varchar("id", { length: 36 }).primaryKey(),

  tenantId: varchar("tenant_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  billingId: varchar("billing_id", { length: 36 })
    .notNull()
    .references(() => tenantBilling.id, { onDelete: "cascade" }),

  receiptNumber: varchar("receipt_number", { length: 100 }).notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  receiptUrl: longtext("receipt_url").notNull(),
  paymentDate: timestamp("payment_date", { fsp: 3 }).notNull(),

  verificationStatus: varchar("verification_status", { length: 30 })
    .default("pending"),

  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).defaultNow()
});

export const sellerApplications = mysqlTable("seller_applications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sellerId: varchar("seller_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  submittedAt: timestamp("submitted_at", { fsp: 3 }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { fsp: 3 }),
})

export const applicationDocuments = mysqlTable("application_documents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  applicationId: varchar("application_id", { length: 36 })
    .notNull()
    .references(() => sellerApplications.id, { onDelete: "cascade" }),
  documentType: varchar("document_type", { length: 100 }).notNull(),
  documentURL: longtext("document_url").notNull(),
  verified: boolean("verified").default(false).notNull(),
})

export const shopReviews = mysqlTable("shop_reviews", {
  id: varchar("id", { length: 36 }).primaryKey(),
  shopId: varchar("shop_id", { length: 36 })
    .notNull()
    .references(() => shop.id, { onDelete: "cascade" }),
  buyerId: varchar("buyer_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  orderId: varchar("order_id", { length: 36 })
    .references(() => orders.id, { onDelete: "set null" }),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).$onUpdate(() => new Date()),
});

export const sellerNotifications = mysqlTable("seller_notifications", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sellerId: varchar("seller_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  billingId: varchar("billing_id", { length: 36 })
    .references(() => tenantBilling.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("payment_reminder").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  sentBy: varchar("sent_by", { length: 36 })
    .references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  readAt: timestamp("read_at", { fsp: 3 }),
});

