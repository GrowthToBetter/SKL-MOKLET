-- CreateTable
CREATE TABLE `User` (
    `user_id` CHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `photo_profile` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `clasess` VARCHAR(191) NULL,
    `absent` VARCHAR(191) NULL,
    `Phone` VARCHAR(191) NULL,
    `NIS` VARCHAR(191) NULL,
    `NISN` VARCHAR(191) NULL,
    `schoolOrigin` VARCHAR(191) NULL,
    `role` ENUM('SISWA', 'GURU', 'ADMIN') NOT NULL DEFAULT 'SISWA',
    `biography` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `github` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `BirthDate` VARCHAR(191) NULL,
    `religion` ENUM('Islam', 'Kristen_Protestan', 'Kristen_Katolik', 'Budha', 'Hindu', 'Konghucu') NULL DEFAULT 'Islam',
    `gender` ENUM('Male', 'Female') NULL DEFAULT 'Male',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAuth` (
    `userauth_id` CHAR(36) NOT NULL,
    `password` VARCHAR(191) NULL,
    `last_login` DATETIME(3) NULL,
    `task` VARCHAR(191) NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserAuth_userEmail_key`(`userEmail`),
    PRIMARY KEY (`userauth_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConditionToPast` (
    `condition_id` CHAR(36) NOT NULL,
    `condition` VARCHAR(191) NULL,
    `UserId` VARCHAR(191) NOT NULL,
    `TeacherId` VARCHAR(191) NOT NULL,
    `userAuthTask` BOOLEAN NOT NULL DEFAULT false,
    `teacherAuth` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('PENDING', 'VERIFIED', 'DENIED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`condition_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserAuth` ADD CONSTRAINT `UserAuth_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConditionToPast` ADD CONSTRAINT `ConditionToPast_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConditionToPast` ADD CONSTRAINT `ConditionToPast_TeacherId_fkey` FOREIGN KEY (`TeacherId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
