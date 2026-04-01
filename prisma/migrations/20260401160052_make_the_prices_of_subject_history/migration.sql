/*
  Warnings:

  - You are about to drop the column `grade_level` on the `curriculumsubjects` table. All the data in the column will be lost.
  - You are about to drop the column `birthdate` on the `student` table. All the data in the column will be lost.
  - Added the required column `grade_level` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frozen_price` to the `CurriculumSubjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middle_name` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Curriculum_curriculum_code_key` ON `curriculum`;

-- AlterTable
ALTER TABLE `curriculum` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `grade_level` ENUM('grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6') NOT NULL;

-- AlterTable
ALTER TABLE `curriculumsubjects` DROP COLUMN `grade_level`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `frozen_price` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `birthdate`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `date_of_birth` DATETIME(3) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` ENUM('male', 'female') NOT NULL,
    ADD COLUMN `middle_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subject` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `SubjectPrice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_code` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hash_password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `user_id` INTEGER NOT NULL,
    `role` ENUM('registrar', 'cashier', 'admin') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Role_role_key`(`role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubjectPrice` ADD CONSTRAINT `SubjectPrice_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Subject`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
