/*
  Warnings:

  - You are about to drop the column `teacherId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_teacherId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `teacherId`;
