import { fetchData } from "lib/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();
global.fetch = fetchMock;

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockImplementation(({ queryFn, queryKey }) => {
    return Promise.resolve(queryFn({ queryKey }));
  }),
}));

describe("fetchData", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("fetches status", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "ok" }),
    } as Response);

    await expect(fetchData("url")).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith("url");
  });

  it("throws error on network failure", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(fetchData("url")).rejects.toThrow("Network response was not ok");
    expect(fetchMock).toHaveBeenCalledWith("url");
  });
});
