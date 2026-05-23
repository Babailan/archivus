/*
  Warnings:

  - The values [declined] on the enum `Enrollment_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Enrollment` MODIFY `status` ENUM('approved', 'dropped') NOT NULL DEFAULT 'approved';
