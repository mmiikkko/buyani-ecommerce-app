ALTER TABLE `orders` DROP FOREIGN KEY `orders_address_id_addresses_id_fk`;
--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_address_id_addresses_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE cascade ON UPDATE no action;