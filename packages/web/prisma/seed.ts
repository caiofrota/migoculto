import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      password: hashedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      email: "user1@example.com",
      firstName: "User",
      lastName: "One",
      password: await bcrypt.hash("user1password", 10),
    },
  });

  await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      email: "user2@example.com",
      firstName: "User",
      lastName: "Two",
      password: await bcrypt.hash("user2password", 10),
    },
  });

  await prisma.group.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Default Group",
      description: "This is the default group.",
      eventDate: new Date(),
      password: "pass",
      ownerId: 1,
      members: {
        connectOrCreate: [
          {
            where: { id: 1 },
            create: { userId: 1, isConfirmed: true },
          },
          {
            where: { id: 2 },
            create: { userId: 2, isConfirmed: true },
          },
          {
            where: { id: 3 },
            create: { userId: 3, isConfirmed: true },
          },
        ],
      },
    },
  });

  await prisma.group.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Another Group",
      description: "This is the another group.",
      eventDate: new Date(),
      password: "pass",
      ownerId: 1,
      members: {
        connectOrCreate: [
          {
            where: { id: 1 },
            create: { userId: 1, isConfirmed: true },
          },
          {
            where: { id: 2 },
            create: { userId: 2, isConfirmed: true },
          },
          {
            where: { id: 3 },
            create: { userId: 3, isConfirmed: false },
          },
        ],
      },
    },
  });

  await prisma.group.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "User2's Group",
      description: "This is a default group for user 2.",
      eventDate: new Date(),
      password: "pass",
      ownerId: 2,
      members: {
        connectOrCreate: [
          {
            where: { id: 2 },
            create: { userId: 2, isConfirmed: true },
          },
          {
            where: { id: 3 },
            create: { userId: 3, isConfirmed: true },
          },
        ],
      },
    },
  });

  await prisma.group.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Default Group 2",
      description: "This is another default group for user 2.",
      eventDate: new Date(),
      password: "pass",
      ownerId: 2,
      members: {
        connectOrCreate: [
          {
            where: { id: 1 },
            create: { userId: 1, isConfirmed: true, archivedAt: new Date() },
          },
          {
            where: { id: 2 },
            create: { userId: 2, isConfirmed: true },
          },
          {
            where: { id: 3 },
            create: { userId: 3, isConfirmed: true },
          },
        ],
      },
    },
  });

  await prisma.message.createMany({
    data: [
      {
        content: "Welcome to the Default Group!",
        groupId: 1,
        senderId: 1,
        createdAt: new Date(),
      },
      {
        content: "Hello everyone!",
        groupId: 1,
        senderId: 2,
        createdAt: new Date(),
      },
      {
        content: "Hi Admin public!",
        groupId: 1,
        senderId: 3,
        createdAt: new Date(),
      },
      {
        content: "Hi Admin!",
        groupId: 1,
        senderId: 3,
        receiverId: 1,
        createdAt: new Date(),
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
