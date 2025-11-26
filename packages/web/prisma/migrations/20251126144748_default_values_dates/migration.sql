/*
  Warnings:

  - A unique constraint covering the columns `[group_id,user_id]` on the table `member` will be added. If there are existing duplicate values, this will fail.
  - Made the column `joined_at` on table `member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_read_at` on table `member` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `member` MODIFY `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `last_read_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `member_group_user_uk1` ON `member`(`group_id`, `user_id`);
