import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    adapter:
      process.env.NODE_ENV === "production"
        ? new PrismaNeon({ connectionString: process.env.DATABASE_URL })
        : new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = createPrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        validateUserData(args.data, "create");
        return query(args);
      },
      async upsert({ args, query }) {
        validateUserData(args.create, "create");
        validateUserData(args.update, "update");
        return query(args);
      },
      async createMany({ args, query }) {
        if (!Array.isArray(args.data)) {
          validateUserData(args.data, "create");
        } else {
          args.data.forEach((data) => validateUserData(data, "create"));
        }
        return query(args);
      },
    },
  },
});

function validateUserData(data: any, mode: "create" | "update") {
  if (mode === "create") {
    if (!(data.email && data.password) && !(data.appleId || data.googleId)) {
      throw new Error("Cannot create user without email and password or third-party ID.");
    }
  }
}
