/*
  Warnings:

  - A unique constraint covering the columns `[condition]` on the table `ConditionToPast` will be added. If there are existing duplicate values, this will fail.
  - Made the column `task` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Task` MODIFY `task` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ConditionToPast_condition_key` ON `ConditionToPast`(`condition`);
