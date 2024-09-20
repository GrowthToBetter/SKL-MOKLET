/*
  Warnings:

  - A unique constraint covering the columns `[taskId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `taskId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_taskId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `taskId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_taskId_key` ON `User`(`taskId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`task_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
