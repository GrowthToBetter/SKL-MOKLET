/*
  Warnings:

  - You are about to drop the column `UserId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_taskId_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `UserId`,
    ADD COLUMN `userID` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Task_userID_key` ON `Task`(`userID`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `task_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`task_id`) ON DELETE SET NULL ON UPDATE CASCADE;
