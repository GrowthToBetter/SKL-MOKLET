/*
  Warnings:

  - You are about to drop the column `task` on the `UserAuth` table. All the data in the column will be lost.
  - Made the column `condition` on table `ConditionToPast` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ConditionToPast` MODIFY `condition` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `UserAuth` DROP COLUMN `task`;

-- CreateTable
CREATE TABLE `Task` (
    `Task_id` CHAR(36) NOT NULL,
    `task` VARCHAR(191) NULL,

    UNIQUE INDEX `Task_task_key`(`task`),
    PRIMARY KEY (`Task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConditionToPast` ADD CONSTRAINT `ConditionToPast_condition_fkey` FOREIGN KEY (`condition`) REFERENCES `Task`(`task`) ON DELETE RESTRICT ON UPDATE CASCADE;
