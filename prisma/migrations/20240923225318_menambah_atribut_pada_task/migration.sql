-- AlterTable
ALTER TABLE `Task` ADD COLUMN `classes` ENUM('X', 'XI', 'XII') NULL,
    ADD COLUMN `title` ENUM('RPL', 'PG', 'TKJ') NULL;
