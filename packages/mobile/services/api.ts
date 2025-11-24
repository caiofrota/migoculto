import { CustomError, NetworkError } from "@/errors";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "@/storage";

class CreateApiService {
  private baseUrl: string = process.env.EXPO_PUBLIC_API_URL!;

  private async handleResponse<T>(response: Response): Promise<T> {
    try {
      const data = await response.json();
      if (!response.ok) {
        throw new CustomError({ ...data, type: data.error });
      }
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(username: string, password: string) {
    const data = await this.fetchOnce("/session", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    await saveTokens(data.access_token, data.refresh_token);
    return data;
  }

  async logout() {
    await clearTokens();
  }

  async refreshTokens() {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const refreshData = await this.fetchOnce("/session/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });
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

  async getAllGroups(): Promise<Group[]> {
    return await this.get<Group[]>("/group/all");
  }

  private async buildHeaders() {
    const token = await getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  private async fetchOnce<T = any>(uri: string, options?: RequestInit): Promise<T> {
    try {
      const headers = await this.buildHeaders();
      const response = await fetch(`${this.baseUrl}${uri}`, { method: "GET", headers, ...options });
      return await this.handleResponse(response);
    } catch (err: any) {
      if (err instanceof TypeError && err.message === "Network request failed") {
        throw new NetworkError();
      }
      throw err;
    }
  }

  private async fetch<T = any>(uri: string, options?: RequestInit): Promise<T> {
    try {
      return await this.fetchOnce<T>(uri, options);
    } catch (err: any) {
      if (err instanceof CustomError && err.type === "UnauthorizedError") {
        await this.refreshTokens();
        return await this.fetchOnce<T>(uri, options);
      }
      throw err;
    }
  }

  private async get<T>(uri: string, options?: RequestInit): Promise<T> {
    return await this.fetch<T>(uri, { method: "GET", ...options });
  }

  private async post<T>(uri: string, options?: RequestInit): Promise<T> {
    return await this.fetch<T>(uri, { method: "POST", ...options });
  }

  private async put<T>(uri: string, options?: RequestInit): Promise<T> {
    return await this.fetch<T>(uri, { method: "PUT", ...options });
  }

  private async delete<T>(uri: string, options?: RequestInit): Promise<T> {
    return await this.fetch<T>(uri, { method: "DELETE", ...options });
  }
}
export const apiService = new CreateApiService();

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Group = {
  id: number;
  password: string;
  name: string;
  description: string | null;
  eventDate: Date;
  additionalInfo: string | null;
  location: string | null;
  ownerId: number;
  status: "OPEN" | "CLOSED" | "DRAWN";
  archivedAt: Date | null;
  isOwner: boolean;
  isArchived: boolean;
  unreadCount: number;
  messages: {
    id: number;
    senderId: number;
    receiverId: number | null;
    content: string;
    createdAt: Date;
  }[];
  unreadMessages: {
    id: number;
    senderId: number;
    receiverId: number | null;
    content: string;
    createdAt: Date;
  }[];
  lastMessage: {
    id: number;
    senderId: number;
    receiverId: number | null;
    content: string;
    createdAt: Date;
  } | null;
};
