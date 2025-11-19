import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  await prisma.group.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Default Group",
      description: "This is the default group.",
      eventDate: new Date(),
      password: "pass",
      ownerId: 1,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
