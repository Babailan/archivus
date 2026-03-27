/*
  Warnings:

  - The primary key for the `enrollees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `enrollees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Enrollees_first_name_key` ON `enrollees`;

-- AlterTable
ALTER TABLE `enrollees` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
