import { CustomError, NetworkError } from "@/errors";
import { clearTokens, getAccessToken, getPushNotificationToken, getRefreshToken, saveTokens } from "@/storage";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { expo } from "../app.json";

function parseDeviceType(deviceType: Device.DeviceType | null) {
  switch (deviceType) {
    case Device.DeviceType.PHONE:
      return "PHONE";
    case Device.DeviceType.TABLET:
      return "TABLET";
    case Device.DeviceType.DESKTOP:
      return "DESKTOP";
    default:
      return "UNKNOWN";
  }
}

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
    await this.me();
    return data;
  }

  async logout() {
    const pushNotificationToken = await getPushNotificationToken();
    await this.post<User>("/session/logout", {
      body: JSON.stringify({ pushNotificationToken }),
    });
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
    const pushNotificationToken = await getPushNotificationToken();
    return await this.post<User>("/session/me", {
      body: JSON.stringify({
        platform: Platform.OS,
        platformVersion: Platform.Version,
        appVersion: expo.version,
        runtimeVersion: expo.runtimeVersion,
        appRevision: process.env.EXPO_PUBLIC_APP_REVISION || undefined,
        deviceType: parseDeviceType(Device.deviceType) || undefined,
        deviceName: Device.deviceName || undefined,
        osName: Device.osName || undefined,
        osVersion: Device.osVersion || undefined,
        pushNotificationToken,
      }),
    });
  }

  group = {
    all: async (): Promise<Group[]> => {
      return await this.get<Group[]>("/groups");
    },
    create: async (data: Omit<GroupCreateData, "id">): Promise<GroupCreateData> => {
      return await this.post<GroupCreateData>("/groups", { body: JSON.stringify(data) });
    },
    details: async (groupId: number): Promise<any> => {
      return await this.get<Group>(`/groups/${groupId}`);
    },
    sendMessage: async (groupId: number, content: string, receiverId?: number): Promise<any> => {
      return await this.post<any>(`/groups/${groupId}/message`, {
        body: JSON.stringify({ content, receiverId }),
      });
    },
    markAsRead: async (groupId: number): Promise<any> => {
      return await this.post<any>(`/groups/${groupId}/mark-as-read`, {
        body: JSON.stringify({ groupId }),
      });
    },
    join: async (groupId: number, password: string): Promise<any> => {
      return await this.post<any>(`/groups/${groupId}/join`, {
        body: JSON.stringify({ password }),
      });
    },
    draw: async (groupId: number): Promise<any> => {
      return await this.post<any>(`/groups/${groupId}/draw`);
    },
  };

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
  firstName: string;
  lastName: string;
  email: string;
  createdAd: string;
};

export type Group = {
  id: number;
  userId: number;
  password: string;
  name: string;
  description: string | null;
  eventDate: string;
  additionalInfo: string | null;
  location: string | null;
  ownerId: number;
  status: "OPEN" | "CLOSED" | "DRAWN";
  archivedAt: string | null;
  isConfirmed: boolean;
  lastReadAt: string | null;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  lastMessageAt: string | null;
  unreadCount: number;
  myAssignedUserId: number | null;
  assignedOfUserId: number | undefined;
  myMemberId: number;
  lastUpdate: string;
  members: {
    id: number;
    userId: number;
    firstName: string | null;
    lastName: string | null;
    isConfirmed: boolean;
    wishlistCount: number;
  }[];
  lastMessage: {
    id: number;
    sender: string;
    content: string;
    createdAt: string;
    isMine: boolean;
  } | null;
};

export type GroupDetail = Group & {
  groupMessages: {
    id: number;
    sender: string;
    content: string;
    createdAt: string;
    isMine: boolean;
  }[];
  messagesAsGiftSender: {
    id: number;
    sender: string;
    content: string;
    createdAt: string;
    isMine: boolean;
  }[];
  messagesAsGiftReceiver: {
    id: number;
    sender: string;
    content: string;
    createdAt: string;
    isMine: boolean;
  }[];
};

type GroupCreateData = {
  id: number;
  name: string;
  password: string;
  eventDate: string;
  description?: string;
  additionalInfo?: string;
  location?: string;
};
