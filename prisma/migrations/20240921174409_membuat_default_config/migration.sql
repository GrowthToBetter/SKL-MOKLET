/*
  Warnings:

  - You are about to drop the `TaskUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TaskUser` DROP FOREIGN KEY `TaskUser_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `TaskUser` DROP FOREIGN KEY `TaskUser_userId_fkey`;

-- DropTable
DROP TABLE `TaskUser`;

-- CreateTable
CREATE TABLE `_Task_id` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_Task_id_AB_unique`(`A`, `B`),
    INDEX `_Task_id_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Task_id` ADD CONSTRAINT `_Task_id_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Task_id` ADD CONSTRAINT `_Task_id_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
