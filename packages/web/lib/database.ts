import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export const prisma = new PrismaClient({ adapter }).$extends({
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
