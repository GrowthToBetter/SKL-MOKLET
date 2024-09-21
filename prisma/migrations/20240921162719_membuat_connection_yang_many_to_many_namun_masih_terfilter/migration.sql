/*
  Warnings:

  - You are about to drop the `_Task_id` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_Task_id` DROP FOREIGN KEY `_Task_id_A_fkey`;

-- DropForeignKey
ALTER TABLE `_Task_id` DROP FOREIGN KEY `_Task_id_B_fkey`;

-- DropTable
DROP TABLE `_Task_id`;

-- CreateTable
CREATE TABLE `TaskUser` (
    `task_user_id` CHAR(36) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `progress` INTEGER NOT NULL,
    `userAuthTask` BOOLEAN NOT NULL DEFAULT false,
    `teacherAuth` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `TaskUser_userId_taskId_key`(`userId`, `taskId`),
    PRIMARY KEY (`task_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaskUser` ADD CONSTRAINT `TaskUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskUser` ADD CONSTRAINT `TaskUser_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;
