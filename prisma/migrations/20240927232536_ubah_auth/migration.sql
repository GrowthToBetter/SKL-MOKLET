/*
  Warnings:

  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `teacherAuth` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `userAuthTask` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Detail` ADD COLUMN `status` ENUM('PENDING', 'VERIFIED', 'DENIED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `teacherAuth` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userAuthTask` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `status`,
    DROP COLUMN `teacherAuth`,
    DROP COLUMN `userAuthTask`;
