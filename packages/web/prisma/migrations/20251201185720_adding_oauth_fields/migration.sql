/*
  Warnings:

  - A unique constraint covering the columns `[apple_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[google_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `apple_id` VARCHAR(191) NULL,
    ADD COLUMN `google_id` VARCHAR(191) NULL,
    ADD COLUMN `last_login_at` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_apple_id_key` ON `user`(`apple_id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_google_id_key` ON `user`(`google_id`);
