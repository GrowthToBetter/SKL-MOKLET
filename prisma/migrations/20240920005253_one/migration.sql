-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_teacherId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `teacherId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
