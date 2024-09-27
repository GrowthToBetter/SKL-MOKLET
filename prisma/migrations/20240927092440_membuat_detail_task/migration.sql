-- AlterTable
ALTER TABLE `User` ADD COLUMN `ClassNumber` INTEGER NULL;

-- CreateTable
CREATE TABLE `Detail` (
    `task_id` CHAR(36) NOT NULL,
    `Detail` VARCHAR(191) NULL,
    `idTask` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Detail` ADD CONSTRAINT `Detail_idTask_fkey` FOREIGN KEY (`idTask`) REFERENCES `Task`(`task_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
