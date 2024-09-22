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
    `status` ENUM('NOTGRADUATE', 'GRADUATE') NOT NULL DEFAULT 'NOTGRADUATE',
    `whatsapp` VARCHAR(191) NULL,
    `BirthDate` VARCHAR(191) NULL,
    `religion` ENUM('Islam', 'Kristen_Protestan', 'Kristen_Katolik', 'Budha', 'Hindu', 'Konghucu') NULL DEFAULT 'Islam',
    `gender` ENUM('Male', 'Female') NULL DEFAULT 'Male',
    `Sugestion` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classTeacher` (
    `class_teacher` CHAR(36) NOT NULL,
    `classesTeacher` VARCHAR(191) NULL,

    PRIMARY KEY (`class_teacher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAuth` (
    `userauth_id` CHAR(36) NOT NULL,
    `password` VARCHAR(191) NULL,
    `last_login` DATETIME(3) NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserAuth_userEmail_key`(`userEmail`),
    PRIMARY KEY (`userauth_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `task_id` CHAR(36) NOT NULL,
    `Task` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `userAuthTask` BOOLEAN NOT NULL DEFAULT false,
    `teacherAuth` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('PENDING', 'VERIFIED', 'DENIED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_teacherClass` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_teacherClass_AB_unique`(`A`, `B`),
    INDEX `_teacherClass_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_teacherToStudent` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_teacherToStudent_AB_unique`(`A`, `B`),
    INDEX `_teacherToStudent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_taskTeacher` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_taskTeacher_AB_unique`(`A`, `B`),
    INDEX `_taskTeacher_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserAuth` ADD CONSTRAINT `UserAuth_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacherClass` ADD CONSTRAINT `_teacherClass_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacherClass` ADD CONSTRAINT `_teacherClass_B_fkey` FOREIGN KEY (`B`) REFERENCES `classTeacher`(`class_teacher`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacherToStudent` ADD CONSTRAINT `_teacherToStudent_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacherToStudent` ADD CONSTRAINT `_teacherToStudent_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_taskTeacher` ADD CONSTRAINT `_taskTeacher_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_taskTeacher` ADD CONSTRAINT `_taskTeacher_B_fkey` FOREIGN KEY (`B`) REFERENCES `classTeacher`(`class_teacher`) ON DELETE CASCADE ON UPDATE CASCADE;
