/*
  Warnings:

  - Added the required column `rentAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `lateFeeAmount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `lateFeeStartDate` DATETIME(3) NULL,
    ADD COLUMN `rentAmount` DOUBLE NOT NULL,
    ADD COLUMN `terminationDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Lease` ADD COLUMN `dailyLateFee` DOUBLE NOT NULL DEFAULT 100,
    ADD COLUMN `lateFeeStartDay` INTEGER NOT NULL DEFAULT 3,
    ADD COLUMN `terminationDay` INTEGER NOT NULL DEFAULT 30;
