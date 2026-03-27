/*
  Warnings:

  - You are about to drop the column `status` on the `student` table. All the data in the column will be lost.
  - You are about to drop the `applicant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `applicant` DROP FOREIGN KEY `Applicant_studentId_fkey`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `status`;

-- DropTable
DROP TABLE `applicant`;

-- CreateTable
CREATE TABLE `Subject` (
    `subject_code` VARCHAR(191) NOT NULL,
    `subject_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Subject_subject_code_key`(`subject_code`),
    PRIMARY KEY (`subject_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curriculum` (
    `curriculum_code` VARCHAR(191) NOT NULL,
    `curriculum_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Curriculum_curriculum_code_key`(`curriculum_code`),
    PRIMARY KEY (`curriculum_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CurriculumSubjects` (
    `curriculum_code` VARCHAR(191) NOT NULL,
    `subject_code` VARCHAR(191) NOT NULL,
    `grade_level` ENUM('grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6') NOT NULL,

    PRIMARY KEY (`curriculum_code`, `subject_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CurriculumSubjects` ADD CONSTRAINT `CurriculumSubjects_curriculum_code_fkey` FOREIGN KEY (`curriculum_code`) REFERENCES `Curriculum`(`curriculum_code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CurriculumSubjects` ADD CONSTRAINT `CurriculumSubjects_subject_code_fkey` FOREIGN KEY (`subject_code`) REFERENCES `Subject`(`subject_code`) ON DELETE RESTRICT ON UPDATE CASCADE;
