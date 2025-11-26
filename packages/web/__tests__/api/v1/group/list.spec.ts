import prisma from "__tests__/__mocks__/prisma";

import { GET } from "app/api/v1/groups/route";
import { NextRequest } from "next/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  requestUser: vi.fn().mockResolvedValue({ id: 1, isActive: true } as any),
}));

vi.mock("app/api/v1/session/authentication", async () => ({
  getRequestUser: hoisted.requestUser,
}));

describe("GET /api/v1/groups", () => {
  const membership = {
    id: 1,
    groupId: 1,
    userId: 1,
    createdAt: new Date("2024-11-30T10:00:00.000Z"),
    joinedAt: new Date("2024-11-30T10:00:00.000Z"),
    lastReadAt: new Date("2024-11-30T13:00:00.000Z"),
  };
  const group = {
    id: 1,
    name: "Family Group",
    password: "family123",
    description: "A group for family members",
    additionalInfo: "Some additional info about the family group",
    ownerId: 1,
    location: "123 Family St, City, Country",
    status: "active",
    eventDate: new Date("2024-12-25T19:00:00.000Z"),
    members: [],
  };
  const messages = [
    {
      id: 1,
      senderId: 2,
      receiverId: null,
      content: "Hello everyone!",
      createdAt: new Date("2024-11-30T12:00:00.000Z"),
    },
    {
      id: 2,
      senderId: 3,
      receiverId: 1,
      content: "Hi! How are you?",
      createdAt: new Date("2024-11-30T14:00:00.000Z"),
    },
    { id: 3, senderId: 2, receiverId: null, content: "Don't forget the event tomorrow!", createdAt: new Date("2024-11-30T10:00:00.000Z") },
    {
      id: 4,
      senderId: 1,
      receiverId: null,
      content: "Looking forward to seeing you all!",
      createdAt: new Date("2024-11-30T15:00:00.000Z"),
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
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      isActive: true,
    } as any);
  });

  it("should return all groups for the user", async () => {
    prisma.member.findMany.mockResolvedValueOnce([
      {
        ...membership,
        group,
      },
    ] as any);
    prisma.message.findMany.mockResolvedValue(messages as any);

    const request = new NextRequest("http://localhost:3000/api/v1/group/all", {
      method: "GET",
      headers: { Authorization: "Bearer valid_token" },
    });

    const response = await GET(request, {} as any);
    expect(response.status).toBe(200);

    const responseData = await response.json();
    console.log(responseData);
    expect(responseData).toEqual([
      {
        id: 1,
        additionalInfo: "Some additional info about the family group",
        description: "A group for family members",
        eventDate: "2024-12-25T19:00:00.000Z",
        isOwner: true,
        lastMessageAt: "2024-11-30T15:00:00.000Z",
        lastRead: "2024-11-30T13:00:00.000Z",
        lastUpdate: "2024-11-30T15:00:00.000Z",
        location: "123 Family St, City, Country",
        members: [],
        myMemberId: 1,
        name: "Family Group",
        ownerId: 1,
        password: "family123",
        status: "active",
        unreadCount: 2,
        userId: 1,
        lastMessage: {
          content: "Looking forward to seeing you all!",
          createdAt: "2024-11-30T15:00:00.000Z",
          id: 4,
          isMine: true,
          sender: "Eu",
        },
      },
    ]);
  });
});
