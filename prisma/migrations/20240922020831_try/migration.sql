/*
  Warnings:

  - You are about to drop the `_TaskToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_TaskToUser` DROP FOREIGN KEY `_TaskToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TaskToUser` DROP FOREIGN KEY `_TaskToUser_B_fkey`;

-- DropTable
DROP TABLE `_TaskToUser`;

-- CreateTable
CREATE TABLE `_task_teacher` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_task_teacher_AB_unique`(`A`, `B`),
    INDEX `_task_teacher_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_task_teacher` ADD CONSTRAINT `_task_teacher_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_task_teacher` ADD CONSTRAINT `_task_teacher_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
