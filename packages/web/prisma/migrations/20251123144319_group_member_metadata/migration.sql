-- AlterTable
ALTER TABLE `member` ADD COLUMN `archived_at` DATETIME(3) NULL,
    ADD COLUMN `joined_at` DATETIME(3) NULL,
    ADD COLUMN `last_read_at` DATETIME(3) NULL;
