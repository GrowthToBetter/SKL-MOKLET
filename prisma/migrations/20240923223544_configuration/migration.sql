-- AlterTable
ALTER TABLE `User` ADD COLUMN `detail` INTEGER NULL,
    MODIFY `clasess` ENUM('X', 'XI', 'XII') NULL,
    ALTER COLUMN `title` DROP DEFAULT;
