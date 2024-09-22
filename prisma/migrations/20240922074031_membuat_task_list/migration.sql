-- CreateTable
CREATE TABLE `taskList` (
    `task_list` CHAR(36) NOT NULL,
    `task` VARCHAR(191) NULL,

    PRIMARY KEY (`task_list`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
