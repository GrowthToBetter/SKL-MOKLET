-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_teacherId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `taskId` VARCHAR(191) NULL,
    MODIFY `teacherId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`task_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
