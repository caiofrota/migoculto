import { describe, expect, it } from "vitest";
import { MigocultoApiClient } from ".";

describe("MigocultoApiClient", () => {
  it("normalizes a trailing slash in the base URL", async () => {
    const requests: string[] = [];
    const client = new MigocultoApiClient({
      baseUrl: "https://example.test/api/v1/",
      fetcher: (async (url: string) => {
        requests.push(url);
        return Response.json([]);
      }) as typeof fetch
    });

    await client.group.all();

    expect(requests).toEqual(["https://example.test/api/v1/groups"]);
  });
});
