import bcrypt from "bcryptjs";
import { PrismaFactory } from "lib/database";
import { UnauthorizedError } from "errors";
import { createAccessToken, createRefreshToken, verify } from "./jwt";

async function getUserByEmail(username: string) {
  const user = await PrismaFactory.getInstance().user.findUnique({ where: { email: username } });
  if (!user) {
    throw new UnauthorizedError({
      message: "Usuário não encontrado.",
      action: "Por favor, verifique o nome de usuário e tente novamente.",
      errorLocationCode: "SESSION:AUTHENTICATION:GET_USER_BY_EMAIL:USER_NOT_FOUND",
    });
  }
  return user;
}

async function comparePasswords(password: string, hashedPassword: string) {
  const match = await bcrypt.compare(password, hashedPassword);
  if (!match) {
    throw new UnauthorizedError({
      message: "Senha incorreta.",
      action: "Por favor, verifique sua senha e tente novamente.",
      errorLocationCode: "SESSION:AUTHENTICATION:COMPARE_PASSWORDS:PASSWORD_MISMATCH",
    });
  }
}

export async function authenticateWithCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);
  await comparePasswords(password, user.password);
  return {
    accessToken: await createAccessToken({ sub: String(user.id), email, role: user.role }),
    refreshToken: await createRefreshToken({ sub: String(user.id) }),
  };
}

export async function authenticateWithRefreshToken(refreshToken: string) {
  try {
    const { sub } = await verify(refreshToken);
    const user = await PrismaFactory.getInstance().user.findUnique({ where: { id: Number(sub) } });
    if (!user) throw new UnauthorizedError({ message: "Usuário não encontrado." });
    return {
      accessToken: await createAccessToken({ sub: String(user.id), email: user.email, role: user.role }),
      refreshToken: await createRefreshToken({ sub: String(user.id) }),
    };
  } catch (error) {
    throw new UnauthorizedError({
      message: "Token de atualização inválido.",
      action: "Por favor, forneça um token de atualização válido.",
    });
  }
}
