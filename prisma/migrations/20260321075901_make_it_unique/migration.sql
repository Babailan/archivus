/*
  Warnings:

  - The primary key for the `curriculumsubjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[curriculum_code,subject_code]` on the table `CurriculumSubjects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `curriculumsubjects` DROP PRIMARY KEY;

-- CreateIndex
CREATE UNIQUE INDEX `CurriculumSubjects_curriculum_code_subject_code_key` ON `CurriculumSubjects`(`curriculum_code`, `subject_code`);
