import type { DeviceMetadata, Group, GroupCreateData, GroupDetail, User } from "@migoculto/types";

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type ApiClientOptions = {
  baseUrl: string;
  fetcher?: typeof fetch;
  getAccessToken?: () => Promise<string | null>;
  getRefreshToken?: () => Promise<string | null>;
  getPushNotificationToken?: () => Promise<string | null>;
  saveTokens?: (accessToken: string, refreshToken: string) => Promise<void>;
  clearTokens?: () => Promise<void>;
  getDeviceMetadata?: () => Promise<DeviceMetadata> | DeviceMetadata;
};

export class ApiClientError extends Error {
  action?: string;
  status?: number;
  type?: string;

  constructor(args: { action?: string; message: string; status?: number; type?: string }) {
    super(args.message);
    this.name = "ApiClientError";
    this.action = args.action;
    this.status = args.status;
    this.type = args.type;
  }
}

export class NetworkError extends ApiClientError {
  constructor() {
    super({
      message: "Não foi possível conectar ao MigOculto. Verifique sua conexão e tente novamente.",
      type: "NetworkError"
    });
    this.name = "NetworkError";
  }
}

export class MigocultoApiClient {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;
  private readonly getAccessToken?: () => Promise<string | null>;
  private readonly getRefreshToken?: () => Promise<string | null>;
  private readonly getPushNotificationToken?: () => Promise<string | null>;
  private readonly saveTokens?: (accessToken: string, refreshToken: string) => Promise<void>;
  private readonly clearTokens?: () => Promise<void>;
  private readonly getDeviceMetadata?: () => Promise<DeviceMetadata> | DeviceMetadata;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.fetcher = options.fetcher ?? fetch;
    this.getAccessToken = options.getAccessToken;
    this.getRefreshToken = options.getRefreshToken;
    this.getPushNotificationToken = options.getPushNotificationToken;
    this.saveTokens = options.saveTokens;
    this.clearTokens = options.clearTokens;
    this.getDeviceMetadata = options.getDeviceMetadata;
  }

  async login(username: string, password: string) {
    const data = await this.fetchOnce<{ access_token: string; refresh_token: string }>("/session", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    await this.saveTokens?.(data.access_token, data.refresh_token);
    return this.me();
  }

  async loginWithApple(identityToken: string, givenName?: string, familyName?: string) {
    const data = await this.fetchOnce<{ access_token: string; refresh_token: string }>("/session/apple", {
      method: "POST",
      body: JSON.stringify({ identityToken, givenName, familyName })
    });
    await this.saveTokens?.(data.access_token, data.refresh_token);
    return this.me();
  }

  async logout() {
    const pushNotificationToken = await this.getPushNotificationToken?.();
    await this.post<User>("/session/logout", {
      body: JSON.stringify({ pushNotificationToken })
    });
    await this.clearTokens?.();
  }

  async refreshTokens() {
    const refreshToken = await this.getRefreshToken?.();
    if (!refreshToken) {
      throw new ApiClientError({
        message: "Nenhum token de atualização disponível.",
        action: "Por favor, faça login novamente.",
        type: "NoRefreshTokenError"
      });
    }

    const refreshData = await this.fetchOnce<{ access_token: string; refresh_token: string }>("/session/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json"
      }
    });
    await this.saveTokens?.(refreshData.access_token, refreshData.refresh_token);
  }

  async me(): Promise<User> {
    const [metadata, pushNotificationToken] = await Promise.all([
      this.getDeviceMetadata?.() ?? {},
      this.getPushNotificationToken?.() ?? null
    ]);

    return this.post<User>("/session/me", {
      body: JSON.stringify({
        ...metadata,
        pushNotificationToken
      })
    });
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    return this.fetchOnce<{ message: string }>("/user", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password })
    });
  }

  async editProfile(firstName: string, lastName: string) {
    return this.put<User>("/user", {
      body: JSON.stringify({ firstName, lastName })
    });
  }

  async forgotPassword(email: string) {
    return this.fetchOnce<{ message: string }>("/user/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  }

  group = {
    all: async (): Promise<Group[]> => this.get<Group[]>("/groups"),
    create: async (data: Omit<GroupCreateData, "id" | "code">): Promise<GroupCreateData> =>
      this.post<GroupCreateData>("/groups", { body: JSON.stringify(data) }),
    update: async (id: string | number, data: Partial<GroupCreateData>): Promise<GroupDetail> =>
      this.put<GroupDetail>("/groups", { body: JSON.stringify({ id, ...data }) }),
    details: async (groupId: number): Promise<GroupDetail> => this.get<GroupDetail>(`/groups/${groupId}`),
    sendMessage: async (groupId: number, content: string, receiverId?: number): Promise<GroupDetail> =>
      this.post<GroupDetail>(`/groups/${groupId}/message`, {
        body: JSON.stringify({ content, receiverId })
      }),
    markAsRead: async (groupId: number): Promise<{ ok: true }> =>
      this.post<{ ok: true }>(`/groups/${groupId}/mark-as-read`, {
        body: JSON.stringify({ groupId })
      }),
    join: async (groupId: string, password: string): Promise<GroupDetail> =>
      this.post<GroupDetail>(`/groups/${groupId}/join`, {
        body: JSON.stringify({ password })
      }),
    draw: async (groupId: number): Promise<GroupDetail> => this.post<GroupDetail>(`/groups/${groupId}/draw`),
    leave: async (groupId: number): Promise<GroupDetail> => this.post<GroupDetail>(`/groups/${groupId}/leave`),
    removeMember: async (groupId: number, memberId: number): Promise<GroupDetail> =>
      this.post<GroupDetail>(`/groups/${groupId}/remove/${memberId}`)
  };

  wishlist = {
    addItem: async (groupId: number, name: string, url?: string, description?: string) =>
      this.post(`/groups/${groupId}/wishlist`, {
        body: JSON.stringify({ name, url, description })
      }),
    removeItem: async (groupId: number, itemId: number) =>
      this.delete(`/groups/${groupId}/wishlist/remove/${itemId}`)
  };

  private async buildHeaders() {
    const token = await this.getAccessToken?.();
    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json"
    };
  }

  private async fetchOnce<T = unknown>(uri: string, options?: RequestInit): Promise<T> {
    try {
      const headers = await this.buildHeaders();
      const response = await this.fetcher(`${this.baseUrl}${uri}`, {
        method: "GET",
        headers,
        ...options,
        ...(options?.headers ? { headers: { ...headers, ...options.headers } } : {})
      });
      return this.handleResponse<T>(response);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Network request failed") {
        throw new NetworkError();
      }
      throw err;
    }
  }

  private async fetch<T = unknown>(uri: string, options?: RequestInit): Promise<T> {
    try {
      return await this.fetchOnce<T>(uri, options);
    } catch (err) {
      if (err instanceof ApiClientError && err.type === "UnauthorizedError") {
        await this.refreshTokens();
        return this.fetchOnce<T>(uri, options);
      }
      throw err;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) {
      throw new ApiClientError({
        action: data.action,
        message: Array.isArray(data.message) ? data.message.join("\n") : data.message,
        status: response.status,
        type: data.error
      });
    }
    return data as T;
  }

  private async get<T>(uri: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(uri, { method: "GET", ...options });
  }

  private async post<T>(uri: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(uri, { method: "POST", ...options });
  }

  private async put<T>(uri: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(uri, { method: "PUT", ...options });
  }

  private async delete<T>(uri: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(uri, { method: "DELETE", ...options });
  }
}
