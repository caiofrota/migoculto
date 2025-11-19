import bcrypt from "bcryptjs";
import { prisma } from "lib/database";
import { UnauthorizedError } from "errors";
import { createAccessToken, createRefreshToken, getJwtPayloadFromCookies, verify } from "./jwt";
import { NextRequest } from "next/server";

async function getUser(params: { id: number } | { email: string }) {
  const user = await prisma.user.findUnique({ where: params });
  if (user) {
    if (user.isActive) {
      return user;
    }
    throw new UnauthorizedError({
      message: "Conta de usuário inativa.",
      action: "Por favor, entre em contato com o suporte para reativar sua conta.",
      errorLocationCode: "SESSION:AUTHENTICATION:GET_USER_BY_EMAIL:USER_INACTIVE",
    });
  }
  throw new UnauthorizedError({
    message: "Usuário não encontrado.",
    action: "Por favor, verifique o nome de usuário e tente novamente.",
    errorLocationCode: "SESSION:AUTHENTICATION:GET_USER_BY_EMAIL:USER_NOT_FOUND",
  });
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
  const user = await getUser({ email });
  await comparePasswords(password, user.password);
  return {
    accessToken: await createAccessToken({ sub: String(user.id), email, role: user.role }),
    refreshToken: await createRefreshToken({ sub: String(user.id) }),
  };
}

export async function authenticateWithRefreshToken(refreshToken: string) {
  try {
    const { sub } = await verify(refreshToken);
    const user = await getUser({ id: Number(sub) });
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

export async function getSessionUser(request: NextRequest) {
  const payload = await getJwtPayloadFromCookies(request);
  const user = await getUser({ id: Number(payload?.sub) });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getRequestUser(request: NextRequest) {
  const payload = await getJwtPayloadFromCookies(request);
  if (!payload) return null;
  const user = await getUser({ id: Number(payload?.sub) });
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
