-- AlterTable
ALTER TABLE `payrolls` ADD COLUMN `shipment_status` ENUM('SENT', 'NOT_SENT') NOT NULL DEFAULT 'NOT_SENT';
