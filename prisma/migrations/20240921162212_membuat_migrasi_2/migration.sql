/*
  Warnings:

  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `taskid` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_taskid_fkey` FOREIGN KEY (`taskid`) REFERENCES `Task`(`task_id`) ON DELETE SET NULL ON UPDATE CASCADE;
