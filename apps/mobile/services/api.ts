import { ApiClientError, MigocultoApiClient, NetworkError as SharedNetworkError } from "@migoculto/api-client";
import type { DeviceMetadata, Group, GroupCreateData, GroupDetail, User } from "@migoculto/types";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { expo } from "../app.json";
import { CustomError, NetworkError } from "@/errors";
import { clearTokens, getAccessToken, getPushNotificationToken, getRefreshToken, saveTokens } from "@/storage";

function parseDeviceType(deviceType: Device.DeviceType | null): DeviceMetadata["deviceType"] {
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

function getDeviceMetadata(): DeviceMetadata {
  return {
    platform: Platform.OS,
    platformVersion: Platform.Version,
    appVersion: expo.version,
    runtimeVersion: expo.runtimeVersion,
    appRevision: process.env.EXPO_PUBLIC_APP_REVISION || undefined,
    deviceType: parseDeviceType(Device.deviceType),
    deviceName: Device.deviceName,
    osName: Device.osName,
    osVersion: Device.osVersion,
  };
}

const client = new MigocultoApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL!,
  clearTokens,
  getAccessToken,
  getDeviceMetadata,
  getPushNotificationToken,
  getRefreshToken,
  saveTokens: async (accessToken, refreshToken) => {
    await saveTokens(accessToken, refreshToken);
  },
});

function normalizeError(error: unknown): never {
  if (error instanceof SharedNetworkError) {
    throw new NetworkError({ message: error.message });
  }

  if (error instanceof ApiClientError) {
    throw new CustomError({
      name: error.type ?? error.name,
      message: error.message,
      action: error.action,
      statusCode: error.status,
      type: error.type,
    });
  }

  throw error;
}

function withMobileErrors<TArgs extends unknown[], TResult>(
  callback: (...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args) => {
    try {
      return await callback(...args);
    } catch (error) {
      normalizeError(error);
    }
  };
}

export const apiService = {
  login: withMobileErrors((username: string, password: string) => client.login(username, password)),
  loginWithApple: withMobileErrors((identityToken: string, givenName?: string, familyName?: string) =>
    client.loginWithApple(identityToken, givenName, familyName),
  ),
  logout: withMobileErrors(() => client.logout()),
  refreshTokens: withMobileErrors(() => client.refreshTokens()),
  me: withMobileErrors(() => client.me()),
  register: withMobileErrors((firstName: string, lastName: string, email: string, password: string) =>
    client.register(firstName, lastName, email, password),
  ),
  editProfile: withMobileErrors((firstName: string, lastName: string) => client.editProfile(firstName, lastName)),
  forgotPassword: withMobileErrors((email: string) => client.forgotPassword(email)),
  group: {
    all: withMobileErrors(() => client.group.all()),
    create: withMobileErrors((data: Omit<GroupCreateData, "id" | "code">) => client.group.create(data)),
    update: withMobileErrors((id: string | number, data: Partial<GroupCreateData>) => client.group.update(id, data)),
    details: withMobileErrors((groupId: number) => client.group.details(groupId)),
    sendMessage: withMobileErrors((groupId: number, content: string, receiverId?: number) =>
      client.group.sendMessage(groupId, content, receiverId),
    ),
    markAsRead: withMobileErrors((groupId: number) => client.group.markAsRead(groupId)),
    join: withMobileErrors((groupId: string, password: string) => client.group.join(groupId, password)),
    draw: withMobileErrors((groupId: number) => client.group.draw(groupId)),
    leave: withMobileErrors((groupId: number) => client.group.leave(groupId)),
    removeMember: withMobileErrors((groupId: number, memberId: number) => client.group.removeMember(groupId, memberId)),
  },
  wishlist: {
    addItem: withMobileErrors((groupId: number, name: string, url?: string, description?: string) =>
      client.wishlist.addItem(groupId, name, url, description),
    ),
    removeItem: withMobileErrors((groupId: number, itemId: number) => client.wishlist.removeItem(groupId, itemId)),
  },
};

export type { Group, GroupCreateData, GroupDetail, User };
