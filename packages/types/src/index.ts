export const groupStatuses = ["OPEN", "CLOSED", "DRAWN"] as const;

export type GroupStatus = (typeof groupStatuses)[number];

export type ApiSuccess<T> = {
  data: T;
};

export type ApiFailure = {
  error: {
    action?: string;
    code: string;
    id?: string;
    message: string | string[];
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type User = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  createdAt?: string;
};

export type WishlistItem = {
  id: number;
  name: string;
  url: string | null;
  description: string | null;
};

export type MemberSummary = {
  id: number;
  userId: number;
  assignedUserId?: number | null;
  firstName: string | null;
  lastName: string | null;
  isConfirmed: boolean;
  wishlistCount: number;
  wishlist: WishlistItem[];
};

export type GroupMessage = {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
  isMine: boolean;
};

export type Group = {
  id: number;
  code: string | null;
  userId: number;
  password: string;
  name: string;
  description: string | null;
  eventDate: string;
  additionalInfo: string | null;
  location: string | null;
  ownerId: number;
  status: GroupStatus;
  archivedAt: string | null;
  isConfirmed: boolean;
  lastReadAt?: string | null;
  lastRead?: string | null;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  lastMessageAt: string | null;
  unreadCount: number;
  myAssignedUserId: number | null;
  assignedOfUserId: number | undefined;
  myMemberId: number;
  lastUpdate: string;
  members: MemberSummary[];
  lastMessage: GroupMessage | null;
};

export type GroupDetail = Group & {
  groupMessages: GroupMessage[];
  messagesAsGiftSender: GroupMessage[];
  messagesAsGiftReceiver: GroupMessage[];
};

export type GroupCreateData = {
  id: number;
  code: string;
  name: string;
  password: string;
  eventDate: string;
  description?: string;
  additionalInfo?: string;
  location?: string;
};

export type DeviceMetadata = {
  platform?: string;
  platformVersion?: string | number;
  appVersion?: string;
  runtimeVersion?: string;
  appRevision?: string | number;
  deviceType?: "PHONE" | "TABLET" | "DESKTOP" | "UNKNOWN";
  deviceName?: string | null;
  osName?: string | null;
  osVersion?: string | null;
  pushNotificationToken?: string | null;
};
