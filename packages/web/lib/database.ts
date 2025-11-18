import { PrismaClient } from "@prisma/client";

export class PrismaFactory {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaFactory.instance) {
      PrismaFactory.instance = new PrismaClient();
    }
    return PrismaFactory.instance;
  }
}
