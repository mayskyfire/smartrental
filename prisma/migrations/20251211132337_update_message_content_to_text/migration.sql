-- AlterTable
ALTER TABLE `LineMessageLog` MODIFY `messageContent` TEXT NOT NULL;

-- CreateIndex
CREATE INDEX `Invoice_status_idx` ON `Invoice`(`status`);

-- CreateIndex
CREATE INDEX `Invoice_dueDate_idx` ON `Invoice`(`dueDate`);

-- CreateIndex
CREATE INDEX `Invoice_billingYear_billingMonth_idx` ON `Invoice`(`billingYear`, `billingMonth`);

-- CreateIndex
CREATE INDEX `Lease_status_idx` ON `Lease`(`status`);

-- CreateIndex
CREATE INDEX `Unit_propertyId_idx` ON `Unit`(`propertyId`);

-- CreateIndex
CREATE INDEX `Unit_status_idx` ON `Unit`(`status`);

-- RenameIndex
ALTER TABLE `Invoice` RENAME INDEX `Invoice_propertyId_fkey` TO `Invoice_propertyId_idx`;

-- RenameIndex
ALTER TABLE `Lease` RENAME INDEX `Lease_tenantId_fkey` TO `Lease_tenantId_idx`;

-- RenameIndex
ALTER TABLE `Lease` RENAME INDEX `Lease_unitId_fkey` TO `Lease_unitId_idx`;
