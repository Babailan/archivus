/*
  Warnings:

  - You are about to alter the column `status` on the `student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `student` MODIFY `status` ENUM('ENROLLED', 'ACCEPTED', 'APPLICANT') NOT NULL;
