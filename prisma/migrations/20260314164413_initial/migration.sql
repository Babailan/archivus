-- CreateTable
CREATE TABLE `Enrollees` (
    `first_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Enrollees_first_name_key`(`first_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
