/*
  Warnings:

  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `student` table. All the data in the column will be lost.
  - The values [ENROLLED,ACCEPTED,APPLICANT] on the enum `Student_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `student_id` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `student_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `status` ENUM('enrolled', 'accepted', 'applicant') NOT NULL,
    ADD PRIMARY KEY (`student_id`);

-- CreateTable
CREATE TABLE `Applicant` (
    `applicant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,

    PRIMARY KEY (`applicant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
