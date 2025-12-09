import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";

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
    group: {
      async create({ args, query }) {
        const maxAttempts = 5;

        const callerProvidedCode = !!args.data.code;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          if (!callerProvidedCode || attempt > 1) {
            args.data.code = generateGroupCode();
          }

          try {
            return await query(args);
          } catch (error) {
            if (!callerProvidedCode && isGroupCodeUniqueError(error)) {
              if (attempt < maxAttempts) continue;
              throw new Error("Failed to generate a unique group code after multiple attempts.");
            }
            throw error;
          }
        }
        throw new Error("Unexpected error generating group code.");
      },
      async upsert({ args, query }) {
        const maxAttempts = 5;
        const callerProvidedCode = !!args.create.code;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          if (!callerProvidedCode || attempt > 1) {
            args.create.code = generateGroupCode();
          }

          try {
            return await query(args);
          } catch (error) {
            if (!callerProvidedCode && isGroupCodeUniqueError(error)) {
              if (attempt < maxAttempts) continue;
              throw new Error("Failed to generate a unique group code after multiple attempts.");
            }
            throw error;
          }
        }

        throw new Error("Unexpected error generating group code (upsert).");
      },
      async createMany({ args, query }) {
        const data = args.data;
        const codesInBatch = new Set<string>();

        if (!Array.isArray(data)) {
          if (!data.code) {
            let code: string;
            do {
              code = generateGroupCode();
            } while (codesInBatch.has(code));
            data.code = code;
            codesInBatch.add(code);
          }
        } else {
          for (const item of data) {
            if (!item.code) {
              let code: string;
              do {
                code = generateGroupCode();
              } while (codesInBatch.has(code));
              item.code = code;
              codesInBatch.add(code);
            }
          }
        }

        return query(args);
      },
    },
  },
});

function isGroupCodeUniqueError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== "P2002") return false;

  const target = error.meta?.target;
  if (Array.isArray(target)) return target.includes("code");
  if (typeof target === "string") return target.includes("code");
  return false;
}

function generateGroupCode() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const nanoid = customAlphabet(alphabet, 8);
  return nanoid();
}

function validateUserData(data: any, mode: "create" | "update") {
  if (mode === "create") {
    if (!(data.email && data.password) && !(data.appleId || data.googleId)) {
      throw new Error("Cannot create user without email and password or third-party ID.");
    }
  }
}
