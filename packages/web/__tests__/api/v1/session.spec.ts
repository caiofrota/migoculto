import prisma from "__tests__/__mocks__/prisma";
import { POST } from "app/api/v1/session/route";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
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
}));

describe("Session API", async () => {
  const users = [
    {
      id: 1,
      password: await bcrypt.hash("password", 10),
      email: "admin@test.com",
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
      password: await bcrypt.hash("anything", 10),
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
    prisma.user.findUnique.mockImplementation(
      (args) => users.find((user) => (args.where.id ? user.id === args.where.id : user.email === args.where.email)) as any,
    );
  });

  it("should return 200 for correct credentials and set cookies with access and refresh tokens", async () => {
    hoisted.mockedToken.mockResolvedValueOnce("access_token");
    hoisted.mockedToken.mockResolvedValueOnce("refresh_token");

    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({ username: "admin@test.com", password: "password" }),
    });

    const response = await POST(request);

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ access_token: expect.any(String), refresh_token: expect.any(String) });
    expect(response.cookies.get("access_token")?.value).toBe("access_token");
    expect(response.cookies.get("refresh_token")?.value).toBe("refresh_token");
  });

  it("should return 401 for a inactive user", async () => {
    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({ username: "inactive@test.com", password: "anything" }),
    });

    const startMs = Date.now();
    const response = await POST(request);
    const endMs = Date.now();

    const data = await response.json();
    expect(response.status).toBe(401);
    expect(endMs - startMs).toBeGreaterThan(10); // Ensure the response time is at least 10ms to mitigate timing attacks
    expect(data).toMatchObject({
      error: "UnauthorizedError",
      error_id: expect.stringMatching(/^.+$/),
      message: "Nome de usuário ou senha está incorreto.",
      action: "Por favor, verifique seu nome de usuário e senha e tente novamente.",
      status: "error",
    });
  });

  it("should return 401 for incorrect credentials", async () => {
    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({ username: "incorrect@test.com", password: "incorrect-password" }),
    });

    const startMs = Date.now();
    const response = await POST(request);
    const endMs = Date.now();

    const data = await response.json();
    expect(response.status).toBe(401);
    expect(endMs - startMs).toBeGreaterThan(10); // Ensure the response time is at least 10ms to mitigate timing attacks
    expect(data).toMatchObject({
      error: "UnauthorizedError",
      error_id: expect.stringMatching(/^.+$/),
      message: "Nome de usuário ou senha está incorreto.",
      action: "Por favor, verifique seu nome de usuário e senha e tente novamente.",
      status: "error",
    });
  });

  it("should return 401 for incorrect username", async () => {
    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({ username: "incorrect@test.com", password: "password" }),
    });

    const startMs = Date.now();
    const response = await POST(request);
    const endMs = Date.now();

    const data = await response.json();
    expect(response.status).toBe(401);
    expect(endMs - startMs).toBeGreaterThan(10); // Ensure the response time is at least 10ms to mitigate timing attacks
    expect(data).toMatchObject({
      error: "UnauthorizedError",
      error_id: expect.stringMatching(/^.+$/),
      message: "Nome de usuário ou senha está incorreto.",
      action: "Por favor, verifique seu nome de usuário e senha e tente novamente.",
      status: "error",
    });
  });

  it("should return 401 for incorrect password", async () => {
    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({ username: "admin@test.com", password: "incorrect-password" }),
    });

    const response = await POST(request);

    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data).toMatchObject({
      error: "UnauthorizedError",
      error_id: expect.stringMatching(/^.+$/),
      message: "Nome de usuário ou senha está incorreto.",
      action: "Por favor, verifique seu nome de usuário e senha e tente novamente.",
      status: "error",
    });
  });

  it("should return 400 for missing parameters", async () => {
    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      error: "BadRequestError",
      error_id: expect.stringMatching(/^.+$/),
      message: ["Campo 'username' é obrigatório.", "Campo 'password' é obrigatório."],
      status: "error",
    });
  });

  it("should return 400 for missing username", async () => {
    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({ password: "password" }),
    });

    const response = await POST(request);

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      error: "BadRequestError",
      error_id: expect.stringMatching(/^.+$/),
      message: ["Campo 'username' é obrigatório."],
      status: "error",
    });
  });

  it("should return 400 for missing password", async () => {
    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({ username: "admin@test.com" }),
    });

    const response = await POST(request);

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      error: "BadRequestError",
      error_id: expect.stringMatching(/^.+$/),
      message: ["Campo 'password' é obrigatório."],
      status: "error",
    });
  });

  it("should return 400 for missing password", async () => {
    const request = new NextRequest("http://localhost/api/v1/session", {
      method: "POST",
      body: JSON.stringify({ username: "no-email-username", password: "password" }),
    });

    const response = await POST(request);

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      error: "BadRequestError",
      error_id: expect.stringMatching(/^.+$/),
      message: ["Campo 'username' deve ser um endereço de email válido."],
      status: "error",
    });
  });
});
