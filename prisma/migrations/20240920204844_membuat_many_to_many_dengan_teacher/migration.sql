-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_teacherId_fkey`;

-- CreateTable
CREATE TABLE `_teacherToStudent` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_teacherToStudent_AB_unique`(`A`, `B`),
    INDEX `_teacherToStudent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_teacherToStudent` ADD CONSTRAINT `_teacherToStudent_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacherToStudent` ADD CONSTRAINT `_teacherToStudent_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
