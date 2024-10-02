/*
  Warnings:

  - You are about to drop the column `shipment_status` on the `payrolls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payroll_id,employee_id]` on the table `payroll_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `payroll_items` ADD COLUMN `status` ENUM('SENT', 'NOT_SENT') NOT NULL DEFAULT 'NOT_SENT';

-- AlterTable
ALTER TABLE `payrolls` DROP COLUMN `shipment_status`,
    ADD COLUMN `status` ENUM('SENT', 'NOT_SENT', 'SENDING', 'ERROR') NOT NULL DEFAULT 'NOT_SENT';

-- CreateIndex
CREATE UNIQUE INDEX `payroll_items_payroll_id_employee_id_key` ON `payroll_items`(`payroll_id`, `employee_id`);
