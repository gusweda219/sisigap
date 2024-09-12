-- DropForeignKey
ALTER TABLE `allowances` DROP FOREIGN KEY `allowances_payroll_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `deductions` DROP FOREIGN KEY `deductions_payroll_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `payroll_items` DROP FOREIGN KEY `payroll_items_payroll_id_fkey`;

-- AddForeignKey
ALTER TABLE `payroll_items` ADD CONSTRAINT `payroll_items_payroll_id_fkey` FOREIGN KEY (`payroll_id`) REFERENCES `payrolls`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_payroll_item_id_fkey` FOREIGN KEY (`payroll_item_id`) REFERENCES `payroll_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allowances` ADD CONSTRAINT `allowances_payroll_item_id_fkey` FOREIGN KEY (`payroll_item_id`) REFERENCES `payroll_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
