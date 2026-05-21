import prisma from "__tests__/__mocks__/prisma";

import { POST } from "app/api/v1/groups/[groupId]/draw/route";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  mockedVerifyToken: vi.fn(),
}));

vi.mock("jose", () => ({
  jwtVerify: () => {
    return { payload: hoisted.mockedVerifyToken() };
  },
}));

vi.mock("@migoculto/db", async () => {
  const { default: prisma } = await import("__tests__/__mocks__/prisma");
  class PrismaClientMock {
    constructor() {
      return prisma;
    }
  }
  return { Prisma: { PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {} }, PrismaClient: PrismaClientMock, prisma };
});

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

  beforeEach(() => {
    prisma.user.findUnique.mockImplementation((args) => {
      return users.find((user) => user.id === args.where.id) as any;
    });
  });

  it("should draw secret friends successfully", async () => {
    const initialGroup = {
      id: 1,
      ownerId: 1,
      members: [
        { id: 1, userId: 10, name: "Alice" },
        { id: 2, userId: 20, name: "Bob" },
        { id: 3, userId: 30, name: "Charlie" },
      ],
    } as any;
    const updatedGroup = {
      ...initialGroup,
      status: "DRAWN",
      members: initialGroup.members.map((member: any) => ({
        ...member,
        assignedUserId: member.id === 1 ? 20 : member.id === 2 ? 30 : 10,
        user: { devices: [] },
      })),
    };
    prisma.group.findUnique.mockResolvedValueOnce(initialGroup).mockResolvedValueOnce(updatedGroup);
    hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 1 });
    const request = new NextRequest("http://localhost/api/v1/1/draw", {
      method: "POST",
      headers: { Authorization: "Bearer valid_token" },
    });

    const response = await POST(request, { params: { groupId: 1 } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(updatedGroup);
    expect(prisma.member.update).toHaveBeenCalledTimes(3);
    expect(prisma.group.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { updatedAt: expect.any(Date), status: "DRAWN" },
    });
    expect(prisma.message.deleteMany).toHaveBeenCalledWith({ where: { groupId: 1, receiverId: { not: null } } });
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
        { id: 1, userId: 10, name: "Alice" },
        { id: 2, userId: 20, name: "Bob" },
        { id: 3, userId: 30, name: "Charlie" },
        { id: 4, userId: 40, name: "David" },
        { id: 5, userId: 50, name: "Eve" },
      ],
    } as any;
    const updatedGroup = {
      ...group,
      status: "DRAWN",
      members: group.members.map((member: any) => ({ ...member, user: { devices: [] } })),
    };
    const request = new NextRequest("http://localhost/api/v1/1/draw", {
      method: "POST",
      headers: { Authorization: "Bearer valid_token" },
    });

    // Try multiple times to ensure randomness
    for (let attempt = 0; attempt < 50; attempt++) {
      hoisted.mockedVerifyToken.mockResolvedValueOnce({ sub: 1 });
      prisma.group.findUnique.mockResolvedValueOnce(group as any).mockResolvedValueOnce(updatedGroup as any);
      const response = await POST(request, { params: { groupId: 1 } });
      expect(response.status).toBe(200);

      await response.json();
      const updates = prisma.member.update.mock.calls.slice(-5).map(([args]) => ({
        giverMemberId: args.where.id,
        receiverUserId: args.data.assignedUserId,
      }));
      const byMemberId = new Map(group.members.map((member: any) => [member.id, member]));
      const memberIdByUserId = new Map(group.members.map((member: any) => [member.userId, member.id]));
      const assignmentByMemberId = new Map(
        updates.map((update) => [update.giverMemberId, memberIdByUserId.get(update.receiverUserId)]),
      );
      const start = group.members[0].id;
      let current = start;
      const visited = new Set<number>();
      while (!visited.has(current)) {
        visited.add(current);
        current = assignmentByMemberId.get(current);
      }
      expect(visited.size).toBe(5);
      expect(current).toBe(start);
      expect([...assignmentByMemberId.entries()].every(([giver, receiver]) => byMemberId.has(giver) && byMemberId.has(receiver))).toBe(true);
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
