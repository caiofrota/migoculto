"use server";

import bcrypt from "bcryptjs";
import { prisma } from "lib/database";

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await prisma.user.update({ where: { token }, data: { password: await bcrypt.hash(newPassword, 10), token: null } });
}
