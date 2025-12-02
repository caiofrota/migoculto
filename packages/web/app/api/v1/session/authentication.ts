import bcrypt from "bcryptjs";
import { UnauthorizedError } from "errors";
import { prisma } from "lib/database";
import { NextRequest } from "next/server";
import { createAccessToken, createRefreshToken, getJwtPayload, getJwtPayloadFromCookies, verify } from "./jwt";

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

export async function getAppleUser(email: string, appleUserId: string, meta?: { givenName?: string; familyName?: string }) {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      lastLoginAt: new Date(),
    },
    create: {
      appleId: appleUserId,
      email: email,
      firstName: meta?.givenName ?? email.split("@")[0],
      lastName: meta?.familyName ?? "",
      isActive: true,
      password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      lastLoginAt: new Date(),
      role: "USER",
    },
  });
  if (user) {
    if (user.isActive) {
      return user;
    }
    throw new UnauthorizedError({
      message: "Conta de usuário inativa.",
      action: "Por favor, entre em contato com o suporte para reativar sua conta.",
      errorLocationCode: "SESSION:AUTHENTICATION:GET_APPLE_USER:USER_INACTIVE",
    });
  }
  throw new UnauthorizedError({
    message: "Usuário não encontrado.",
    action: "Por favor, verifique o nome de usuário e tente novamente.",
    errorLocationCode: "SESSION:AUTHENTICATION:GET_APPLE_USER:USER_NOT_FOUND",
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
  if (!user.password) {
    throw new UnauthorizedError({
      message: "Senha não definida para este usuário.",
      action: "Por favor, utilize outro método de autenticação.",
      errorLocationCode: "SESSION:AUTHENTICATION:AUTHENTICATE_WITH_CREDENTIALS:PASSWORD_NOT_SET",
    });
  }
  await comparePasswords(password, user.password);
  return {
    accessToken: await createAccessToken({ sub: String(user.id), email, role: user.role }),
    refreshToken: await createRefreshToken({ sub: String(user.id) }),
  };
}

export async function authenticateWithApple(
  email: string,
  appleUserId: string,
  meta?: { givenName: string | undefined; familyName: string | undefined },
) {
  const user = await getAppleUser(email, appleUserId, meta);
  return {
    accessToken: await createAccessToken({ sub: String(user.id), email: user.email || undefined, role: user.role }),
    refreshToken: await createRefreshToken({ sub: String(user.id) }),
  };
}

export async function authenticateWithRefreshToken(refreshToken: string) {
  try {
    const { sub } = await verify(refreshToken);
    const user = await getUser({ id: Number(sub) });
    return {
      accessToken: await createAccessToken({ sub: String(user.id), email: user.email || undefined, role: user.role }),
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
  const payload = await getJwtPayload(request);
  const user = await getUser({ id: Number(payload?.sub) });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
