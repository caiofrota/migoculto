/*
  Warnings:

  - You are about to drop the column `uuid` on the `device` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `device_uuid_key` ON `device`;

-- AlterTable
ALTER TABLE `device` DROP COLUMN `uuid`;
