import prisma from "__tests__/__mocks__/prisma";
import { POST } from "app/api/v1/session/refresh/route";
import { NextRequest } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  mockedVerifyToken: vi.fn(),
  mockedToken: vi.fn(),
}));

vi.mock("jose", () => ({
  SignJWT: class {
    setProtectedHeader() {
      return this;
    }
    setIssuedAt() {
      return this;
    }
    setExpirationTime() {
      return this;
    }
    async sign() {
      return hoisted.mockedToken();
    }
  },
  jwtVerify: () => {
    return { payload: hoisted.mockedVerifyToken() };
  },
}));

describe("Session Refresh API", () => {
  const defaultUser = {
    id: 1,
    password: "anything",
    email: "admin@test.com",
    username: "admin",
    firstName: "Admin",
    lastName: "User",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "ADMIN" as const,
  };

  beforeAll(() => {
    vi.stubEnv("ACCESS_TOKEN_EXPIRES_IN", "1m");
    vi.stubEnv("REFRESH_TOKEN_EXPIRES_IN", "1d");
    vi.stubEnv("SESSION_SECRET", "madO9xI8/KKIvMjduhKVcmm2xyDycShl8JquOS2Ngy8=");
    vi.mock("@prisma/client", () => {
      class PrismaClientMock {
        constructor() {
          return prisma;
        }
      }
      return { PrismaClient: PrismaClientMock };
    });
  });

  beforeEach(() => {
    prisma.user.findUnique.mockImplementation((args) => (args.where.id === 1 ? defaultUser : null) as any);
  });

  it("should return 200 for a valid token refresh", async () => {
    hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: "1" });
    hoisted.mockedToken.mockResolvedValueOnce("access_token");
    hoisted.mockedToken.mockResolvedValueOnce("refresh_token");

    const request = new NextRequest("http://localhost/api/v1/session/refresh", {
      method: "POST",
      headers: { Cookie: "refresh_token=valid_refresh_token" },
    });

    const response = await POST(request);

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ status: "ok" });
    console.log(response);
    expect(response.cookies.get("access_token")?.value).toBe("access_token");
    expect(response.cookies.get("refresh_token")?.value).toBe("refresh_token");
  });

  it("should return 401 for a invalid refresh token", async () => {
    hoisted.mockedVerifyToken.mockImplementationOnce(() => {
      throw new Error("Invalid token");
    });

    const request = new NextRequest("http://localhost/api/v1/session/refresh", {
      method: "POST",
      headers: { Cookie: "refresh_token=invalid_refresh_token" },
    });

    const response = await POST(request);

    console.log(response);
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toEqual({
      action: "Por favor, forneça um token de atualização válido.",
      error_id: expect.stringMatching(/^.+$/),
      error: "UnauthorizedError",
      message: "Token de atualização inválido.",
      status: "error",
    });
  });

  it("should return 401 for a invalid user in the refresh token", async () => {
    hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 2 });

    const request = new NextRequest("http://localhost/api/v1/session/refresh", {
      method: "POST",
      headers: { Cookie: "refresh_token=invalid_refresh_token" },
    });

    const response = await POST(request);

    console.log(response);
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toEqual({
      action: "Por favor, forneça um token de atualização válido.",
      error_id: expect.stringMatching(/^.+$/),
      error: "UnauthorizedError",
      message: "Token de atualização inválido.",
      status: "error",
    });
  });

  it("should return 401 for missing refresh token", async () => {
    const request = new NextRequest("http://localhost/api/v1/session/refresh", {
      method: "POST",
    });

    const response = await POST(request);

    console.log(response);
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toEqual({
      action: "Por favor, forneça um token de atualização válido.",
      error_id: expect.stringMatching(/^.+$/),
      error: "UnauthorizedError",
      message: "Nenhum token de atualização fornecido.",
      status: "error",
    });
  });
});
