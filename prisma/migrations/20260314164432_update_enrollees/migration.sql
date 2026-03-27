/*
  Warnings:

  - Added the required column `last_name` to the `Enrollees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `enrollees` ADD COLUMN `last_name` VARCHAR(191) NOT NULL;
