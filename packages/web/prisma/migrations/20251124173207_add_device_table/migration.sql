-- CreateTable
CREATE TABLE `device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(500) NOT NULL,
    `user_id` INTEGER NULL,
    `platform` VARCHAR(100) NOT NULL,
    `platform_version` VARCHAR(100) NOT NULL,
    `app_version` VARCHAR(100) NOT NULL,
    `app_revision` INTEGER NOT NULL DEFAULT 0,
    `runtime_version` VARCHAR(100) NULL,
    `push_notification_token` VARCHAR(500) NULL,
    `device_type` ENUM('UNKNOWN', 'PHONE', 'TABLET', 'DESKTOP') NOT NULL DEFAULT 'UNKNOWN',
    `device_name` VARCHAR(100) NULL,
    `os_name` VARCHAR(100) NULL,
    `os_version` VARCHAR(100) NULL,
    `language` VARCHAR(20) NULL,
    `region` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `device_uuid_key`(`uuid`),
    UNIQUE INDEX `device_push_notification_token_key`(`push_notification_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
