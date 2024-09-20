/*
  Warnings:

  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Task_id` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `task` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `ConditionToPast` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `UserId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - The required column `task_id` was added to the `Task` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `taskId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ConditionToPast` DROP FOREIGN KEY `ConditionToPast_TeacherId_fkey`;

-- DropForeignKey
ALTER TABLE `ConditionToPast` DROP FOREIGN KEY `ConditionToPast_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `ConditionToPast` DROP FOREIGN KEY `ConditionToPast_condition_fkey`;

-- DropIndex
DROP INDEX `Task_task_key` ON `Task`;

-- AlterTable
ALTER TABLE `Task` DROP PRIMARY KEY,
    DROP COLUMN `Task_id`,
    DROP COLUMN `task`,
    ADD COLUMN `Task` VARCHAR(191) NULL,
    ADD COLUMN `UserId` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'VERIFIED', 'DENIED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `task_id` CHAR(36) NOT NULL,
    ADD COLUMN `teacherAuth` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userAuthTask` BOOLEAN NOT NULL DEFAULT false,
    ADD PRIMARY KEY (`task_id`);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `taskId` VARCHAR(191) NOT NULL,
    ADD COLUMN `teacherId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `ConditionToPast`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`task_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
