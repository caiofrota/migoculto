import prisma from "__tests__/__mocks__/prisma";

import { POST } from "app/api/v1/groups/[groupId]/draw/route";
import { NextRequest } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  mockedVerifyToken: vi.fn(),
}));

vi.mock("jose", () => ({
  jwtVerify: () => {
    return { payload: hoisted.mockedVerifyToken() };
  },
}));

describe("Draw secret friends from group endpoint", () => {
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
      email: "user@test.com",
      username: "user",
      firstName: "User",
      lastName: "Test",
      isActive: true,
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

  beforeEach(() => {
    prisma.user.findUnique.mockImplementation((args) => {
      return users.find((user) => user.id === args.where.id) as any;
    });
  });

  it("should draw secret friends successfully", async () => {
    prisma.group.findUnique.mockResolvedValueOnce({
      id: 1,
      ownerId: 1,
      members: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ],
    } as any);
    hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 1 });
    const request = new NextRequest("http://localhost/api/v1/1/draw", {
      method: "POST",
      headers: { Authorization: "Bearer valid_token" },
    });

    const response = await POST(request, { params: { groupId: 1 } });
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual(expect.any(Array<[number, number]>));
  });

  it("should return 401 when user is not authorized", async () => {
    prisma.group.findUnique.mockResolvedValueOnce({
      id: 1,
      ownerId: 1,
      members: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ],
    } as any);
    hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 1 });
    const request = new NextRequest("http://localhost/api/v1/1/draw", {
      method: "POST",
    });

    const response = await POST(request, { params: { groupId: 1 } });
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      action: "Por favor, forneça um token de acesso válido no cabeçalho de autorização.",
      error: "UnauthorizedError",
      error_id: expect.any(String),
      message: "Nenhum token de acesso no cabeçalho de autorização.",
      status: "error",
    });
  });

  it("should create a single closed loop including all members", async () => {
    const group = {
      id: 1,
      ownerId: 1,
      members: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
        { id: 4, name: "David" },
        { id: 5, name: "Eve" },
      ],
    } as any;
    const request = new NextRequest("http://localhost/api/v1/1/draw", {
      method: "POST",
      headers: { Authorization: "Bearer valid_token" },
    });

    // Try multiple times to ensure randomness
    for (let attempt = 0; attempt < 50; attempt++) {
      hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 1 });
      prisma.group.findUnique.mockResolvedValueOnce(group as any);
      const response = await POST(request, { params: { groupId: 1 } });
      expect(response.status).toBe(200);

      const data = await response.json();
      const start = data[0];
      let current = start;
      const visited = new Set<number>();
      while (!visited.has(current)) {
        visited.add(current);
        current = data.find(([giver, _receiver]: any) => giver === current[1]);
      }
      expect(visited.size).toBe(5);
      expect(current).toBe(start);
    }
  });

  it("should return 403 when group is not owned by user", async () => {
    prisma.group.findUnique.mockResolvedValueOnce({
      id: 1,
      ownerId: 2,
    } as any);
    hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 1 });
    const request = new NextRequest("http://localhost/api/v1/1/draw", {
      method: "POST",
      headers: { Authorization: "Bearer valid_token" },
    });

    const response = await POST(request, { params: { groupId: 1 } });
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: "ForbiddenError",
      error_id: expect.any(String),
      message: "Somente o dono do grupo pode sortear os amigos secretos.",
      action: "Por favor, entre em contato com o dono do grupo para realizar o sorteio.",
      status: "error",
    });
  });

  it("should return 500 when group is too small to draw secret friends", async () => {
    prisma.group.findUnique.mockResolvedValueOnce({
      id: 1,
      ownerId: 1,
      members: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    } as any);
    hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 1 });
    const request = new NextRequest("http://localhost/api/v1/1/draw", {
      method: "POST",
      headers: { Authorization: "Bearer valid_token" },
    });

    const response = await POST(request, { params: { groupId: 1 } });
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "InsufficientMembersError",
      error_id: expect.any(String),
      message: "Pelo menos três membros são necessários para realizar o sorteio.",
      status: "error",
    });
  });

  it("should return 400 when group id is not a number", async () => {
    const request = new NextRequest("http://localhost/api/v1/9999/draw", {
      headers: { Authorization: "Bearer valid_token" },
      method: "POST",
    });

    const response = await POST(request, { params: { groupId: "abc" } });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "BadRequestError",
      error_id: expect.any(String),
      message: ["Campo 'groupId' deve ser um número."],
      status: "error",
    });
  });

  it("should return 404 when group is not found", async () => {
    const request = new NextRequest("http://localhost/api/v1/9999/draw", {
      method: "POST",
      headers: { Authorization: "Bearer valid_token" },
    });

    hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 1 });
    const response = await POST(request, { params: { groupId: 9999 } });
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "GroupNotFoundError",
      error_id: expect.any(String),
      message: "Grupo não encontrado.",
      status: "error",
    });
  });
});
