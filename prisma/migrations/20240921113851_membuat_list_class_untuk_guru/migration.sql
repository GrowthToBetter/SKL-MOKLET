/*
  Warnings:

  - You are about to drop the column `classesTeacher` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `classesTeacher`;

-- CreateTable
CREATE TABLE `classTeacher` (
    `class_teacher` CHAR(36) NOT NULL,
    `classesTeacher` VARCHAR(191) NULL,
    `userid` VARCHAR(191) NULL,

    PRIMARY KEY (`class_teacher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classTeacher` ADD CONSTRAINT `classTeacher_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
