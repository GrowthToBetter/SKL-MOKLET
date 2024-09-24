/*
  Warnings:

  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - You are about to drop the `_teacherClass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_teacherToStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classTeacher` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `clasess` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_teacherClass` DROP FOREIGN KEY `_teacherClass_A_fkey`;

-- DropForeignKey
ALTER TABLE `_teacherClass` DROP FOREIGN KEY `_teacherClass_B_fkey`;

-- DropForeignKey
ALTER TABLE `_teacherToStudent` DROP FOREIGN KEY `_teacherToStudent_A_fkey`;

-- DropForeignKey
ALTER TABLE `_teacherToStudent` DROP FOREIGN KEY `_teacherToStudent_B_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `teacherId` VARCHAR(191) NULL,
    ADD COLUMN `title` ENUM('RPL', 'PG', 'TKJ') NULL DEFAULT 'RPL',
    MODIFY `clasess` ENUM('X', 'XI', 'XII') NOT NULL DEFAULT 'X',
    MODIFY `role` ENUM('SISWA', 'GURU', 'ADMIN') NOT NULL DEFAULT 'SISWA';

-- DropTable
DROP TABLE `_teacherClass`;

-- DropTable
DROP TABLE `_teacherToStudent`;

-- DropTable
DROP TABLE `classTeacher`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
