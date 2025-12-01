-- AlterTable
ALTER TABLE `user` ADD COLUMN `contact_email` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;
