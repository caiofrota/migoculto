import { CustomError, NetworkError } from "@/errors";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "@/storage";

class CreateApiService {
  private baseUrl: string = process.env.EXPO_PUBLIC_API_URL!;

  async login(username: string, password: string) {
    const response = await this.fetchOnce("/session", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const isJSON = response.headers.get("content-type")?.includes("application/json");
    const data = isJSON ? await response.json() : null;
    if (!response.ok || !isJSON) {
      if (data && (data as any).message) {
        throw new CustomError(data);
      }
      throw new CustomError({
        name: "LoginError",
        message: "Ocorreu um erro ao fazer login.",
        action: "Por favor, entre em contato com o suporte caso o problema persista.",
      });
    }
    await saveTokens(data.access_token, data.refresh_token);
    return data;
  }

  async logout() {
    await clearTokens();
  }

  async refreshTokens() {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const refreshTokenResponse = await this.fetchOnce("/session/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const refreshData = await refreshTokenResponse.json();
      if (!refreshTokenResponse.ok) {
        throw new CustomError({
          name: "RefreshTokenError",
          message: "Ocorreu um erro ao atualizar o token.",
          action: "Por favor, faça login novamente.",
        });
      }
      await saveTokens(refreshData.access_token, refreshData.refresh_token);
    } else {
      throw new CustomError({
        name: "NoRefreshTokenError",
        message: "Nenhum token de atualização disponível.",
        action: "Por favor, faça login novamente.",
      });
    }
  }

  async me(): Promise<User> {
    return await this.get<User>("/session/me");
  }

  private async buildHeaders() {
    const token = await getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  private async fetchOnce(uri: string, options?: RequestInit): ReturnType<typeof fetch> {
    try {
      const headers = await this.buildHeaders();
      return await fetch(`${this.baseUrl}${uri}`, { method: "GET", headers, ...options });
    } catch (err: any) {
      if (err instanceof TypeError && err.message === "Network request failed") {
        throw new NetworkError();
      }
      throw err;
    }
  }

  private async fetch(uri: string, options?: RequestInit): ReturnType<typeof fetch> {
    const response = await this.fetchOnce(uri, options);
    const data = await response.clone().json();
    if (!response.ok && data.error === "UnauthorizedError") {
      await this.refreshTokens();
      return await this.fetchOnce(uri, options);
    }
    return data;
  }

  private async get<T>(uri: string, options?: RequestInit): Promise<T> {
    const response = await this.fetch(uri, { method: "GET", ...options });
    return await response.json();
  }

  private async post<T>(uri: string, options?: RequestInit): Promise<T> {
    const response = await this.fetch(uri, { method: "POST", ...options });
    return await response.json();
  }

  private async put<T>(uri: string, options?: RequestInit): Promise<T> {
    const response = await this.fetch(uri, { method: "PUT", ...options });
    return await response.json();
  }

  private async delete<T>(uri: string, options?: RequestInit): Promise<T> {
    const response = await this.fetch(uri, { method: "DELETE", ...options });
    return await response.json();
  }
}
export const apiService = new CreateApiService();

export type User = {
  id: number;
  name: string;
  email: string;
};
