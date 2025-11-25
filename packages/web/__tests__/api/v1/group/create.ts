import prisma from "__tests__/__mocks__/prisma";

import { POST } from "app/api/v1/[groupId]/draw/route";
import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  mockedVerifyToken: vi.fn(),
}));

vi.mock("jose", () => ({
  jwtVerify: () => {
    return { payload: hoisted.mockedVerifyToken() };
  },
}));

describe.skip("POST /api/v1/group/create", () => {
  it("should create a new group and return its data", async () => {
    hoisted.mockedVerifyToken.mockReturnValueOnce({ userId: 1 });
    prisma.group.create.mockResolvedValueOnce({
      id: 1,
      ownerId: 1,
      members: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ],
    } as any);

    const requestBody = {
      name: "New Group",
      description: "This is a new group",
      password: "securepassword",
      eventDate: "2024-12-25T00:00:00.000Z",
      additionalInfo: "Some additional info",
      location: "123 Group St, City, Country",
    };

    const request = new NextRequest("http://localhost:3000/api/v1/group/create", {
      method: "POST",
      headers: { Authorization: "Bearer valid_token" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request, {} as any);
    expect(response.status).toBe(201);

    const responseData = await response.json();
    expect(responseData).toHaveProperty("id");
    expect(responseData.name).toBe(requestBody.name);
    expect(responseData.description).toBe(requestBody.description);
    expect(responseData.location).toBe(requestBody.location);
    expect(new Date(responseData.eventDate).toISOString()).toBe(requestBody.eventDate);
  });
});
