/*
  Warnings:

  - You are about to drop the column `archived_at` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `last_read_at` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `match_id` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `wishlist` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `wishlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `member` DROP FOREIGN KEY `member_match_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_receiver_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `wishlist_member_id_fkey`;

-- DropIndex
DROP INDEX `member_match_idx` ON `member`;

-- DropIndex
DROP INDEX `wishlist_member_idx` ON `wishlist`;

-- AlterTable
ALTER TABLE `member` DROP COLUMN `archived_at`,
    DROP COLUMN `joined_at`,
    DROP COLUMN `last_read_at`,
    DROP COLUMN `match_id`,
    ADD COLUMN `assigned_user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `wishlist` DROP COLUMN `member_id`,
    ADD COLUMN `group_id` INTEGER NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `member_assigned_user_idx` ON `member`(`assigned_user_id`);

-- CreateIndex
CREATE INDEX `wishlist_user_idx` ON `wishlist`(`user_id`);

-- CreateIndex
CREATE INDEX `wishlist_group_idx` ON `wishlist`(`group_id`);

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_assigned_user_id_fkey` FOREIGN KEY (`assigned_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
