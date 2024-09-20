/*
  Warnings:

  - You are about to drop the column `userID` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Task_userID_key` ON `Task`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `userID`;
