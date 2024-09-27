/*
  Warnings:

  - You are about to drop the `Detail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Detail` DROP FOREIGN KEY `Detail_idTask_fkey`;

-- DropTable
DROP TABLE `Detail`;
