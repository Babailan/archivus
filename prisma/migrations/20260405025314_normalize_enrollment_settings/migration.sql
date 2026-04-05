/*
  Warnings:

  - The primary key for the `curriculum` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `curriculumsubjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `curriculum_code` on the `curriculumsubjects` table. All the data in the column will be lost.
  - You are about to drop the column `frozen_price` on the `curriculumsubjects` table. All the data in the column will be lost.
  - You are about to drop the column `subject_code` on the `curriculumsubjects` table. All the data in the column will be lost.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `student_id` on the `student` table. All the data in the column will be lost.
  - The primary key for the `subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subject_code` on the `subjectprice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[curriculum_code]` on the table `Curriculum` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `miscellaneous_fee` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `curriculum_id` to the `CurriculumSubjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `CurriculumSubjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_price_id` to the `CurriculumSubjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `SubjectPrice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `curriculumsubjects` DROP FOREIGN KEY `CurriculumSubjects_curriculum_code_fkey`;

-- DropForeignKey
ALTER TABLE `curriculumsubjects` DROP FOREIGN KEY `CurriculumSubjects_subject_code_fkey`;

-- DropForeignKey
ALTER TABLE `subjectprice` DROP FOREIGN KEY `SubjectPrice_subject_code_fkey`;

-- DropIndex
DROP INDEX `CurriculumSubjects_subject_code_fkey` ON `curriculumsubjects`;

-- DropIndex
DROP INDEX `Role_role_key` ON `role`;

-- DropIndex
DROP INDEX `SubjectPrice_subject_code_fkey` ON `subjectprice`;

-- AlterTable
ALTER TABLE `curriculum` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `inactive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `miscellaneous_fee` DECIMAL(10, 2) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `curriculumsubjects` DROP PRIMARY KEY,
    DROP COLUMN `curriculum_code`,
    DROP COLUMN `frozen_price`,
    DROP COLUMN `subject_code`,
    ADD COLUMN `curriculum_id` INTEGER NOT NULL,
    ADD COLUMN `subject_id` INTEGER NOT NULL,
    ADD COLUMN `subject_price_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`curriculum_id`, `subject_id`);

-- AlterTable
ALTER TABLE `role` ADD PRIMARY KEY (`user_id`, `role`);

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    DROP COLUMN `student_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `subject` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `inactive` BOOLEAN NOT NULL DEFAULT false,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `subjectprice` DROP COLUMN `subject_code`,
    ADD COLUMN `subject_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `curriculum_id` INTEGER NOT NULL,
    `school_year` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'approved', 'declined', 'dropped') NOT NULL DEFAULT 'pending',
    `total_tuition_snapshot` DECIMAL(10, 2) NOT NULL,
    `total_misc_snapshot` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TuitionFeePayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollment_id` INTEGER NOT NULL,
    `amount_paid` DECIMAL(10, 2) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `receipt_no` VARCHAR(191) NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TuitionFeePayment_receipt_no_key`(`receipt_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GradeCurriculumSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_year` VARCHAR(191) NOT NULL,
    `grade_level` ENUM('grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6') NOT NULL,
    `curriculum_id` INTEGER NOT NULL,

    UNIQUE INDEX `GradeCurriculumSetting_school_year_grade_level_key`(`school_year`, `grade_level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnrollmentSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_year` VARCHAR(191) NOT NULL,
    `is_online_enrollment_enabled` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Curriculum_curriculum_code_key` ON `Curriculum`(`curriculum_code`);

-- CreateIndex
CREATE FULLTEXT INDEX `Curriculum_curriculum_code_curriculum_name_idx` ON `Curriculum`(`curriculum_code`, `curriculum_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Subject_subject_code_subject_name_idx` ON `Subject`(`subject_code`, `subject_name`);

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_curriculum_id_fkey` FOREIGN KEY (`curriculum_id`) REFERENCES `Curriculum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TuitionFeePayment` ADD CONSTRAINT `TuitionFeePayment_enrollment_id_fkey` FOREIGN KEY (`enrollment_id`) REFERENCES `Enrollment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectPrice` ADD CONSTRAINT `SubjectPrice_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CurriculumSubjects` ADD CONSTRAINT `CurriculumSubjects_curriculum_id_fkey` FOREIGN KEY (`curriculum_id`) REFERENCES `Curriculum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CurriculumSubjects` ADD CONSTRAINT `CurriculumSubjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CurriculumSubjects` ADD CONSTRAINT `CurriculumSubjects_subject_price_id_fkey` FOREIGN KEY (`subject_price_id`) REFERENCES `SubjectPrice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GradeCurriculumSetting` ADD CONSTRAINT `GradeCurriculumSetting_curriculum_id_fkey` FOREIGN KEY (`curriculum_id`) REFERENCES `Curriculum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
