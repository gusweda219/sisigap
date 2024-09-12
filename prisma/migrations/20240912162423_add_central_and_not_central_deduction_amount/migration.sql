/*
  Warnings:

  - Added the required column `central_deduction_amount` to the `payroll_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `not_central_deduction_amount` to the `payroll_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payroll_items` ADD COLUMN `central_deduction_amount` INTEGER NOT NULL,
    ADD COLUMN `not_central_deduction_amount` INTEGER NOT NULL;
