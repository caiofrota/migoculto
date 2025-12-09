-- CreateEnum
CREATE TYPE "EnumDeviceType" AS ENUM ('UNKNOWN', 'PHONE', 'TABLET', 'DESKTOP');

-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EnumGroupStatus" AS ENUM ('OPEN', 'CLOSED', 'DRAWN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "apple_id" TEXT,
    "google_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "password" TEXT,
    "contact_email" TEXT,
    "last_login_at" TIMESTAMP(3),
    "role" "RoleEnum" NOT NULL DEFAULT 'USER',
    "token" TEXT,
    "reset_password_token" TEXT,
    "reset_password_token_expires_at" TIMESTAMP(3),
    "activation_token" TEXT,
    "activation_token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "additional_info" TEXT,
    "owner_id" INTEGER NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "status" "EnumGroupStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "assigned_user_id" INTEGER,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMP(3),
    "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "priority" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "group_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" INTEGER,
    "platform" VARCHAR(100),
    "platform_version" VARCHAR(100),
    "app_version" VARCHAR(100),
    "app_revision" INTEGER DEFAULT 0,
    "runtime_version" VARCHAR(100),
    "push_notification_token" VARCHAR(500),
    "device_type" "EnumDeviceType" NOT NULL DEFAULT 'UNKNOWN',
    "device_name" VARCHAR(100),
    "os_name" VARCHAR(100),
    "os_version" VARCHAR(100),
    "language" VARCHAR(20),
    "region" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_unique" ON "user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_unique" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_apple_id_unique" ON "user"("apple_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_google_id_unique" ON "user"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_token_unique" ON "user"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_reset_password_token_unique" ON "user"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "user_activation_token_unique" ON "user"("activation_token");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE UNIQUE INDEX "group_uuid_unique" ON "group"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "group_code_unique" ON "group"("code");

-- CreateIndex
CREATE INDEX "group_owner_idx" ON "group"("owner_id");

-- CreateIndex
CREATE INDEX "group_status_idx" ON "group"("status");

-- CreateIndex
CREATE UNIQUE INDEX "member_uuid_unique" ON "member"("uuid");

-- CreateIndex
CREATE INDEX "member_group_idx" ON "member"("group_id");

-- CreateIndex
CREATE INDEX "member_user_idx" ON "member"("user_id");

-- CreateIndex
CREATE INDEX "member_assigned_user_idx" ON "member"("assigned_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_group_user_unique" ON "member"("group_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_uuid_unique" ON "wishlist"("uuid");

-- CreateIndex
CREATE INDEX "wishlist_user_idx" ON "wishlist"("user_id");

-- CreateIndex
CREATE INDEX "wishlist_group_idx" ON "wishlist"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "message_uuid_unique" ON "message"("uuid");

-- CreateIndex
CREATE INDEX "message_group_idx" ON "message"("group_id");

-- CreateIndex
CREATE INDEX "message_sender_idx" ON "message"("sender_id");

-- CreateIndex
CREATE INDEX "message_receiver_idx" ON "message"("receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_uuid_unique" ON "device"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "device_push_notification_token_unique" ON "device"("push_notification_token");

-- CreateIndex
CREATE INDEX "device_user_idx" ON "device"("user_id");

-- CreateIndex
CREATE INDEX "device_device_type_idx" ON "device"("device_type");

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_assigned_user_id_fkey" FOREIGN KEY ("assigned_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
