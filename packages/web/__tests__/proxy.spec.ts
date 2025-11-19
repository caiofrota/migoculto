import prisma from "./__mocks__/prisma";

import { NextRequest, NextResponse } from "next/server";
import { proxy } from "proxy";
import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from "vitest";

global.fetch = vi.fn();
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
  jwtVerify: hoisted.mockedVerifyToken,
}));

describe("Proxy", async () => {
  const users = [
    {
      id: 1,
      password: "anything",
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
    vi.stubEnv("SESSION_NAME", "testing");
    vi.stubEnv("ACCESS_TOKEN_EXPIRES_IN", "1m");
    vi.stubEnv("REFRESH_TOKEN_EXPIRES_IN", "1d");
    vi.stubEnv("SESSION_SECRET", "k6N11Lccw7e4X+Iv+wj5y3To4FOIoQ/aRGC2U5ROn68qeKgYConFqu7wOTIgvmyhcJV2yyd3Q08f9EYEHQFQFg==");
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
    hoisted.mockedVerifyToken.mockReset();
    hoisted.mockedToken.mockReset();
    vi.resetAllMocks();
    prisma.user.findUnique.mockImplementation(
      (args) => users.find((user) => (args.where.id ? user.id === args.where.id : user.email === args.where.email)) as any,
    );
  });

  it("should return 200 when an authenticated user is accessing a non protected route", async () => {
    hoisted.mockedVerifyToken.mockResolvedValue({ payload: { sub: "1", email: "admin", role: "ADMIN" } });
    const request = new NextRequest("http://localhost/dummy", {
      method: "POST",
      headers: {
        Cookie: "access_token=mocked_access_token",
      },
    });

    const response = await proxy(request);
    expect(response.status).toBe(200);
  });

  it("should return 200 when an unauthenticated user is accessing a non protected route", async () => {
    const request = new NextRequest("http://localhost/dummy", {
      method: "POST",
    });

    const response = await proxy(request);
    expect(response.status).toBe(200);
  });

  it("should return 200 when an unauthenticated user be able to access login page", async () => {
    const request = new NextRequest("http://localhost/login", {
      method: "POST",
    });

    const response = await proxy(request);
    expect(response.status).toBe(200);
  });

  it("should return 200 when an authenticated admin user access /admin base path", async () => {
    hoisted.mockedVerifyToken.mockResolvedValue({ payload: { sub: "1", email: "admin", role: "ADMIN" } });
    const request = new NextRequest("http://localhost/admin/dummy", {
      method: "POST",
      headers: {
        Cookie: "access_token=mocked_access_token",
      },
    });

    const response = await proxy(request);
    expect(response.status).toBe(200);
  });

  it("should return 307 and redirect to login the authenticated admin is inactive", async () => {
    hoisted.mockedVerifyToken.mockResolvedValue({ payload: { sub: "2", email: "admin", role: "ADMIN" } });
    const request = new NextRequest("http://localhost/admin/dummy", {
      method: "POST",
      headers: {
        Cookie: "access_token=mocked_access_token",
      },
    });

    const response = await proxy(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/login");
  });

  it("should return 307 and redirect the authenticated admin user from the login page to /admin", async () => {
    hoisted.mockedVerifyToken.mockResolvedValue({ payload: { sub: "1", email: "admin", role: "ADMIN" } });
    const request = new NextRequest("http://localhost/login", {
      method: "POST",
      body: JSON.stringify({ username: "admin", password: "password" }),
      headers: {
        Cookie: "access_token=mocked_access_token;refresh_token=mocked_refresh_token",
      },
    });

    const response = await proxy(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/admin");
  });

  it("should return 307 redirect an unauthenticated user from the /admin/** to /login", async () => {
    hoisted.mockedToken.mockResolvedValue("mocked_token");
    const request = new NextRequest("http://localhost/admin/whatever", {
      method: "POST",
      body: JSON.stringify({ username: "admin", password: "password" }),
    });

    const response = await proxy(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/login");
  });

  describe("Token refresh flow", () => {
    it("should return 200 and update the cookie when access token is expired and refresh token is valid", async () => {
      const cookie = "access_token=expired_access_token; refresh_token=valid_refresh_token";
      const refreshTokenResponse = NextResponse.next();
      refreshTokenResponse.headers.set("Set-Cookie", cookie);
      hoisted.mockedVerifyToken.mockImplementationOnce(() => {
        throw new Error("Token expired");
      });
      (global.fetch as Mock).mockResolvedValueOnce(refreshTokenResponse);
      hoisted.mockedVerifyToken.mockResolvedValue({ payload: { sub: "1", email: "admin", role: "ADMIN" } });
      const request = new NextRequest("http://localhost/admin/dummy", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "password" }),
        headers: {
          Cookie: "access_token=mocked_access_token;refresh_token=mocked_refresh_token",
        },
      });

      const response = await proxy(request);
      expect(response.status).toBe(200);
      expect(response.headers.get("Set-Cookie")).toBe(cookie);
      expect(global.fetch).toHaveBeenCalledWith("http://localhost/api/v1/session/refresh", {
        method: "POST",
        headers: {
          Cookie: "refresh_token=mocked_refresh_token",
        },
      });
    });

    it("should return 307 when refresh token request return a invalid token", async () => {
      const cookie = "access_token=expired_access_token; refresh_token=valid_refresh_token";
      const refreshTokenResponse = NextResponse.next();
      refreshTokenResponse.headers.set("Set-Cookie", cookie);
      hoisted.mockedVerifyToken.mockImplementationOnce(() => {
        throw new Error("Token expired");
      });
      (global.fetch as Mock).mockResolvedValueOnce(refreshTokenResponse);
      hoisted.mockedVerifyToken.mockImplementationOnce(() => {
        throw new Error("Token expired");
      });
      const request = new NextRequest("http://localhost/admin/dummy", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "password" }),
        headers: {
          Cookie: "access_token=mocked_access_token;refresh_token=mocked_refresh_token",
        },
      });

      const response = await proxy(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/login");
    });

    it("should return 307 when refresh token request does not return access token", async () => {
      const refreshTokenResponse = NextResponse.next();
      hoisted.mockedVerifyToken.mockImplementationOnce(() => {
        throw new Error("Token expired");
      });
      (global.fetch as Mock).mockResolvedValueOnce(refreshTokenResponse);
      hoisted.mockedVerifyToken.mockResolvedValue({ payload: { sub: "1", email: "admin", role: "ADMIN" } });
      const request = new NextRequest("http://localhost/admin/dummy", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "password" }),
        headers: {
          Cookie: "access_token=mocked_access_token;refresh_token=mocked_refresh_token",
        },
      });

      const response = await proxy(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/login");
    });

    it("should return 307 when access token is invalid and there's no refresh token", async () => {
      hoisted.mockedVerifyToken.mockImplementationOnce(() => {
        throw new Error("Token expired");
      });
      const request = new NextRequest("http://localhost/admin/dummy", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "password" }),
        headers: {
          Cookie: "access_token=mocked_access_token",
        },
      });

      const response = await proxy(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/login");
    });

    it("should return 307 when both access token and refresh token are invalid", async () => {
      hoisted.mockedVerifyToken.mockImplementation(() => {
        throw new Error("Token expired");
      });
      const request = new NextRequest("http://localhost/admin/dummy", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "password" }),
        headers: {
          Cookie: "access_token=mocked_access_token;refresh_token=invalid_refresh_token",
        },
      });

      const response = await proxy(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/login");
    });

    it("should return 307 when request access token fails", async () => {
      hoisted.mockedVerifyToken.mockImplementationOnce(() => {
        throw new Error("Token expired");
      });
      hoisted.mockedVerifyToken.mockResolvedValue({ payload: { sub: "1", email: "admin", role: "ADMIN" } });
      (global.fetch as Mock).mockResolvedValueOnce({ ok: false });
      const request = new NextRequest("http://localhost/admin/dummy", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "password" }),
        headers: {
          Cookie: "access_token=mocked_access_token;refresh_token=invalid_refresh_token",
        },
      });

      const response = await proxy(request);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost/login");
    });
  });
});
