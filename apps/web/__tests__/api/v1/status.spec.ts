import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "app/api/status/route";
describe("Status API", () => {
  it("GET /api/v1/status", async () => {
    const request = new NextRequest("http://localhost/api/v1/status");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ status: "ok" });
  });
});
