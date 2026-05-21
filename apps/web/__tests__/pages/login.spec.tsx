import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "app/login/page";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

global.fetch = vi.fn();

const { routerPushMock } = vi.hoisted(() => ({
  routerPushMock: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: ({ mutationFn, onSuccess, onError }: any) => ({
    mutateAsync: async (args: any) => {
      try {
        const data = await mutationFn(args);
        onSuccess(data);
      } catch (error) {
        onError(error);
      }
    },
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

describe("Login page", async () => {
  beforeEach(() => {
    (global.fetch as Mock).mockClear();
    cleanup();
  });

  it("should call the login API and redirect on success", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({ ok: true });

    renderLogin();

    await fillAndSubmitForm("test@example.com", "password123");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v1/session",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "test@example.com", password: "password123" }),
      }),
    );
    expect(routerPushMock).toHaveBeenCalledWith("/admin");
  });

  // A test case to validate fields
  it("should validate email and password fields", async () => {
    renderLogin();

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");
    const submitButton = screen.getByTestId("submit-button");

    // Initially, both fields are empty
    expect(emailInput.getAttribute("value")).toBe("");
    expect(passwordInput.getAttribute("value")).toBe("");

    // Both fields are required
    expect(emailInput.getAttribute("required")).toBeDefined();
    expect(passwordInput.getAttribute("required")).toBeDefined();

    // Field types
    expect(emailInput.getAttribute("type")).toBe("email");
    expect(passwordInput.getAttribute("type")).toBe("password");
  });

  it("should show and hide password when toggle is clicked", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({ ok: true });

    renderLogin();

    await fillAndSubmitForm("test@example.com", "password123");

    const toggleButton = screen.getByTestId("toggle-password-visibility");

    await userEvent.click(toggleButton);
    expect(screen.getByTestId("password-input").getAttribute("type")).toBe("text");

    await userEvent.click(toggleButton);
    expect(screen.getByTestId("password-input").getAttribute("type")).toBe("password");
  });

  it("shows error message when server returns an error", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    renderLogin();

    await fillAndSubmitForm("test@example.com", "password123");
    expect(screen.getByTestId("error-message").textContent).toBe("Invalid credentials");
  });

  it("shows error message when network request fails", async () => {
    (global.fetch as Mock).mockRejectedValueOnce({ message: "Invalid credentials" });

    renderLogin();

    await fillAndSubmitForm("test@example.com", "password123");
    expect(screen.getByTestId("error-message").textContent).toBe("Invalid credentials");
  });

  it("should not call the login API if email is not valid", async () => {
    renderLogin();

    await fillAndSubmitForm("no-email-user", "password123");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should not call the login API if username is empty", async () => {
    renderLogin();

    await fillAndSubmitForm(undefined, "password123");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should not call the login API if password is empty", async () => {
    renderLogin();

    await fillAndSubmitForm("test@example.com", undefined);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

function renderLogin() {
  return render(<Page />);
}

async function fillAndSubmitForm(email?: string, password?: string) {
  const emailInput = screen.getByTestId("email-input");
  const passwordInput = screen.getByTestId("password-input");
  const submitButton = screen.getByTestId("submit-button");

  if (email) await userEvent.type(emailInput, email);
  if (password) await userEvent.type(passwordInput, password);
  await userEvent.click(submitButton);
}
