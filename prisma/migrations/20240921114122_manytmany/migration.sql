/*
  Warnings:

  - You are about to drop the column `userid` on the `classTeacher` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `classTeacher` DROP FOREIGN KEY `classTeacher_userid_fkey`;

-- AlterTable
ALTER TABLE `classTeacher` DROP COLUMN `userid`;

-- CreateTable
CREATE TABLE `_teacherClass` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_teacherClass_AB_unique`(`A`, `B`),
    INDEX `_teacherClass_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_teacherClass` ADD CONSTRAINT `_teacherClass_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacherClass` ADD CONSTRAINT `_teacherClass_B_fkey` FOREIGN KEY (`B`) REFERENCES `classTeacher`(`class_teacher`) ON DELETE CASCADE ON UPDATE CASCADE;
