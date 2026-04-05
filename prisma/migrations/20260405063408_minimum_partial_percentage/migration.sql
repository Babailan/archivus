/*
  Warnings:

  - You are about to drop the column `payment_method` on the `tuitionfeepayment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `enrollment` ADD COLUMN `min_partial_payment_override` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `tuitionfeepayment` DROP COLUMN `payment_method`;

-- CreateTable
CREATE TABLE `RollbackRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_id` INTEGER NOT NULL,
    `requested_by_id` INTEGER NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'approved', 'denied', 'cancelled') NOT NULL DEFAULT 'pending',
    `reviewed_by_id` INTEGER NULL,
    `reviewed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RollbackRequest_payment_id_idx`(`payment_id`),
    INDEX `RollbackRequest_status_idx`(`status`),
    INDEX `RollbackRequest_requested_by_id_idx`(`requested_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RollbackRequest` ADD CONSTRAINT `RollbackRequest_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `TuitionFeePayment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RollbackRequest` ADD CONSTRAINT `RollbackRequest_requested_by_id_fkey` FOREIGN KEY (`requested_by_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RollbackRequest` ADD CONSTRAINT `RollbackRequest_reviewed_by_id_fkey` FOREIGN KEY (`reviewed_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
