-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_taskId_fkey`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;
