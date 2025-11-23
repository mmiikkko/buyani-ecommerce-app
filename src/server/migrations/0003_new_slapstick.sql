CREATE TABLE `addresses` (
	`id` varchar(36) NOT NULL,
	`customer_profile_id` varchar(36) NOT NULL,
	`street` varchar(255),
	`baranggay` varchar(255),
	`city` varchar(255),
	`province` varchar(255),
	`region` varchar(255),
	`zipcode` varchar(20),
	`remarks` text,
	`added_at` timestamp(3) DEFAULT (now()),
	`modified_at` timestamp(3),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admin_profile` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`admin_name` varchar(255),
	`status` varchar(50) DEFAULT 'Active',
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `admin_profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_profile_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `admin_profile_admin_name_unique` UNIQUE(`admin_name`)
);
--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` varchar(36) NOT NULL,
	`cart_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`added_at` timestamp(3) DEFAULT (now()),
	`modified_at` timestamp(3),
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_cart_item` UNIQUE(`cart_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` varchar(36) NOT NULL,
	`buyer_id` varchar(36) NOT NULL,
	`created_at` timestamp(3) DEFAULT (now()),
	`modified_at` timestamp(3),
	CONSTRAINT `carts_id` PRIMARY KEY(`id`),
	CONSTRAINT `buyer_unique` UNIQUE(`buyer_id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`category_name` varchar(255) NOT NULL,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_category_name_unique` UNIQUE(`category_name`)
);
--> statement-breakpoint
CREATE TABLE `customer_profile` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`firstname` varchar(255),
	`lastname` varchar(255),
	`added_at` timestamp(3) DEFAULT (now()),
	CONSTRAINT `customer_profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `order_product_unique` UNIQUE(`order_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`buyer_id` varchar(36) NOT NULL,
	`address_id` varchar(36) NOT NULL,
	`price` decimal(10,2),
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`paymentMethod` decimal(10,2),
	`paymentReceived` decimal(10,2),
	`change` decimal(10,2),
	`status` varchar(50),
	`created_at` timestamp(3) DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_inventory` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity_in_stock` int,
	`items_sold` int,
	`restock_level` varchar(50),
	`restock_date` timestamp(3),
	`created_at` timestamp(3) DEFAULT (now()),
	`updated_at` timestamp(3),
	CONSTRAINT `product_inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`shop_id` varchar(36) NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`sku` varchar(255),
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`rating` varchar(10),
	`is_available` boolean DEFAULT true,
	`status` varchar(50) DEFAULT 'Available',
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`buyer_id` varchar(36) NOT NULL,
	`comment` text,
	`rating` int NOT NULL,
	`created_at` timestamp(3) DEFAULT (now()),
	`updated_at` timestamp(3),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `review_unique` UNIQUE(`order_id`,`buyer_id`)
);
--> statement-breakpoint
CREATE TABLE `seller_profile` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`business_address` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `seller_profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `seller_profile_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `shop` (
	`id` varchar(36) NOT NULL,
	`seller_id` varchar(36) NOT NULL,
	`shop_name` varchar(255) NOT NULL,
	`shop_rating` varchar(10),
	`description` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `shop_id` PRIMARY KEY(`id`),
	CONSTRAINT `shop_shop_name_unique` UNIQUE(`shop_name`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`transaction_type` varchar(50),
	`remarks` text,
	`created_at` timestamp(3) DEFAULT (now()),
	`updated_at` timestamp(3),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_customer_profile_id_customer_profile_id_fk` FOREIGN KEY (`customer_profile_id`) REFERENCES `customer_profile`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_profile` ADD CONSTRAINT `admin_profile_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cart_id_carts_id_fk` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `carts` ADD CONSTRAINT `carts_buyer_id_user_id_fk` FOREIGN KEY (`buyer_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_profile` ADD CONSTRAINT `customer_profile_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_buyer_id_user_id_fk` FOREIGN KEY (`buyer_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_address_id_addresses_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_inventory` ADD CONSTRAINT `product_inventory_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_shop_id_shop_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shop`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_buyer_id_user_id_fk` FOREIGN KEY (`buyer_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seller_profile` ADD CONSTRAINT `seller_profile_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shop` ADD CONSTRAINT `shop_seller_id_seller_profile_id_fk` FOREIGN KEY (`seller_id`) REFERENCES `seller_profile`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;