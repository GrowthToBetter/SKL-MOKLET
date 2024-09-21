/*
  Warnings:

  - You are about to drop the column `Matkul` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_TaskToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_TaskToUser` DROP FOREIGN KEY `_TaskToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TaskToUser` DROP FOREIGN KEY `_TaskToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Task` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `Matkul`;

-- DropTable
DROP TABLE `_TaskToUser`;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
