/*
  Warnings:

  - You are about to drop the column `is_anonymous` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `is_anonymous`;
