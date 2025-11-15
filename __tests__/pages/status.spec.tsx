import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "../../app/status/page";

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
}));

describe("Status", () => {
  it("renders loading state", () => {
    useQueryMock.mockReturnValue({
      data: null,
      isLoading: true,
    });
    render(<Page />);
    expect(screen.getByText("Carregando...")).toBeDefined();
  });

  it("renders error state", async () => {
    useQueryMock.mockReturnValue({
      data: { status: "ok" },
      isLoading: false,
    });
    render(<Page />);
    expect(screen.getByText(/{"status":"ok"}/)).toBeDefined();
  });
});
