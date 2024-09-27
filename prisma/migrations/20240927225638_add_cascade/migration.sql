-- DropForeignKey
ALTER TABLE `Detail` DROP FOREIGN KEY `Detail_idTask_fkey`;

-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Detail` ADD CONSTRAINT `Detail_idTask_fkey` FOREIGN KEY (`idTask`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;
