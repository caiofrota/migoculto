import prisma from "__tests__/__mocks__/prisma";
import { POST } from "app/api/v1/session/me/route";
import { NextRequest } from "next/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({ mockedVerifyToken: vi.fn() }));
vi.mock("jose", () => ({
  jwtVerify: () => {
    return { payload: hoisted.mockedVerifyToken() };
  },
}));

describe("GET /api/v1/session/me", () => {
  const users = [
    {
      id: 1,
      password: "anything",
      email: "user@test.com",
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "ADMIN" as const,
    },
    {
      id: 2,
      password: "anything",
      email: "inactive@test.com",
      username: "user",
      firstName: "User",
      lastName: "Test",
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "USER" as const,
    },
  ];

  beforeAll(() => {
    vi.mock("@prisma/client", () => {
      class PrismaClientMock {
        constructor() {
          return prisma;
        }
      }
      return { PrismaClient: PrismaClientMock };
    });
  });

  it("should return the current session user", async () => {
    hoisted.mockedVerifyToken.mockReturnValueOnce({ sub: "1" });
    prisma.user.findUnique.mockResolvedValueOnce(users[0]);

    const req = new NextRequest("http://localhost/api/v1/session/me", {
      method: "POST",
      headers: {
        Authorization: "Bearer valid_token",
      },
      body: JSON.stringify({
        platform: "web",
        platformVersion: "1.0.0",
        runtimeVersion: "1.0.0",
        appVersion: "1.0.0",
        appRevision: 1,
        pushNotificationToken: "expo.push.token",
        deviceType: "desktop",
        deviceName: "User's PC",
        osName: "Windows",
        osVersion: "10",
      }),
    });

    const response = await POST(req);

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({
      id: 1,
      email: "user@test.com",
      firstName: "Admin",
      lastName: "User",
      createdAt: expect.any(String),
    });
  });

  it("should return 401 if no valid token is provided", async () => {
    hoisted.mockedVerifyToken.mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });

    const req = new NextRequest("http://localhost/api/v1/session/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer invalid_token",
      },
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      action: "Por favor, forneça um token de acesso válido no cabeçalho de autorização.",
      error_id: expect.stringMatching(/^.+$/),
      error: "UnauthorizedError",
      message: "Token de acesso inválido no cabeçalho de autorização.",
      status: "error",
    });
  });

  it("should return 401 if user does not exist", async () => {
    hoisted.mockedVerifyToken.mockReturnValueOnce({ sub: "999" });
    prisma.user.findUnique.mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost/api/v1/session/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer valid_token",
      },
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      action: "Por favor, verifique o nome de usuário e tente novamente.",
      error_id: expect.stringMatching(/^.+$/),
      error: "UnauthorizedError",
      message: "Usuário não encontrado.",
      status: "error",
    });
  });

  it("should return 401 if user is inactive", async () => {
    hoisted.mockedVerifyToken.mockReturnValueOnce({ sub: "2" });
    prisma.user.findUnique.mockResolvedValueOnce(users[1]);

    const req = new NextRequest("http://localhost/api/v1/session/me", {
      method: "GET",
      headers: {
        Authorization: "Bearer valid_token",
      },
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      action: "Por favor, entre em contato com o suporte para reativar sua conta.",
      error_id: expect.stringMatching(/^.+$/),
      error: "UnauthorizedError",
      message: "Conta de usuário inativa.",
      status: "error",
    });
  });
});
