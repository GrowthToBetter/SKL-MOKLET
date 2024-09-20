/*
  Warnings:

  - You are about to drop the column `biography` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `biography`,
    DROP COLUMN `github`,
    DROP COLUMN `instagram`,
    DROP COLUMN `linkedin`,
    DROP COLUMN `website`,
    ADD COLUMN `Sugestion` VARCHAR(191) NULL;
