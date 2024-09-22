-- DropForeignKey
ALTER TABLE `_taskTeacher` DROP FOREIGN KEY `_taskTeacher_B_fkey`;

-- AddForeignKey
ALTER TABLE `_taskTeacher` ADD CONSTRAINT `_taskTeacher_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
