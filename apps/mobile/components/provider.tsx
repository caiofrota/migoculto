import { firestore } from "@/core/firebase";
import { registerForPushNotificationsAsync } from "@/core/notifications";
import { CustomError } from "@/errors";
import { apiService, Group, GroupDetail, User } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "@react-navigation/elements";
import * as Notifications from "expo-notifications";
import { collection, onSnapshot } from "firebase/firestore";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Alert, AppState, Linking } from "react-native";
import { getAccessToken, setPushNotificationToken } from "../storage";

const STORAGE_GROUP_PREFIX = "@group-cache:";
const STORAGE_USER_PREFIX = "@user-cache";

type AppContextValue = {
  loading: boolean;
  setUser: (user: User | null) => void;
  // Auth
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithApple: (identityToken: string, givenName?: string, familyName?: string) => Promise<void>;
  logout: () => void;
  // Group cache
  groups: Group[] | null;
  setGroup: (groupId: string | number, data: GroupDetail) => Promise<void>;
  setGroupDetails: (groupId: string | number, data: GroupDetail) => Promise<void>;
  refreshGroup: (groupId: string | number) => Promise<GroupDetail | null>;
  removeGroup: (groupId: string | number) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

interface GroupsCacheProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: GroupsCacheProviderProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const [, setNotification] = useState<Notifications.Notification | boolean>(false);

  const refreshUser = useCallback(async () => {
    try {
      const user = await apiService.me();
      setUser(user);
    } catch (e) {
      if (e instanceof CustomError && e.type === "UnauthorizedError") {
        clearData();
      }
    }
  }, []);

  const refreshGroup = useCallback(async (groupId: string | number): Promise<GroupDetail | null> => {
    try {
      const res = await apiService.group.details(Number(groupId));
      await setGroup(groupId, res);
      return res;
    } catch (e) {
      console.warn("Erro ao buscar grupo no backend:", e);
      return null;
    }
  }, []);

  const initializePushNotifications = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status === "denied" && Math.random() < 0.05) {
      Alert.alert(
        "Ativar Notificações?",
        "Ative as notificações pra receber atualizações dos grupos que você participa e ficar por dentro do que tá rolando!",
        [{ text: "Sim", isPreferred: true, onPress: () => Linking.openURL("app-settings:") }, { text: "Agora não" }],
      );
    }

    const token = await registerForPushNotificationsAsync();
    if (token) {
      setPushNotificationToken(token);
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      const groupId = notification.request.content.data.groupId as number | undefined;
      if (groupId) {
        await refreshGroup(groupId);
      }
      setNotification(notification ?? false);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const groupId = response.notification.request.content.data.groupId as number | undefined;
      if (groupId) {
        await refreshGroup(groupId);
      }
      /* { response: { "data": "ExponentPushToken[**********************]", "type": "expo" } } */
    });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, [refreshGroup]);

  useEffect(() => {
    if (user) {
      AsyncStorage.setItem(`${STORAGE_USER_PREFIX}`, JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (groups) {
      AsyncStorage.setItem(`${STORAGE_GROUP_PREFIX}all`, JSON.stringify(groups));
    }
  }, [groups]);

  async function clearData() {
    setUser(null);
    setGroups(null);
    await AsyncStorage.clear();
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const loggedUser = await apiService.login(email, password);
      setUser(loggedUser);
      refreshGroups();
    } catch (err) {
      console.log("myerror: ", JSON.stringify(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loginWithApple(identityToken: string, givenName?: string, familyName?: string) {
    setLoading(true);
    try {
      const loggedUser = await apiService.loginWithApple(identityToken, givenName, familyName);
      setUser(loggedUser);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearData();
    apiService.logout();
  }

  async function setGroup(groupId: string | number, data: Group) {
    const key = String(groupId);

    setGroups((prevGroups) => {
      if (!prevGroups) return [data];
      const existingIndex = prevGroups.findIndex((group) => group.id === data.id);
      let updatedGroups;
      if (existingIndex !== -1) {
        updatedGroups = [...prevGroups];
        updatedGroups[existingIndex] = data;
      } else {
        updatedGroups = [...prevGroups, data];
      }
      return updatedGroups.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
    });

    try {
      await AsyncStorage.setItem(`${STORAGE_GROUP_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Erro ao salvar grupo no AsyncStorage:", e);
    }
  }

  async function setGroupDetails(groupId: string | number, data: GroupDetail) {
    const key = String(groupId);
    try {
      setGroup(groupId, data);
      await AsyncStorage.setItem(`${STORAGE_GROUP_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Erro ao salvar grupo no AsyncStorage:", e);
    }
  }

  async function removeGroup(groupId: string | number) {
    const key = String(groupId);

    setGroups((prevGroups) => {
      if (!prevGroups) return null;
      const updatedGroups = prevGroups.filter((group) => group.id !== Number(groupId));
      return updatedGroups;
    });

    try {
      await AsyncStorage.removeItem(`${STORAGE_GROUP_PREFIX}${key}`);
    } catch (e) {
      console.warn("Erro ao remover grupo do AsyncStorage:", e);
    }
  }

  const refreshGroups = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setGroups(null);
        return;
      }

      const groups = await apiService.group.all();

      await Promise.all(
        groups.map(async (group) => {
          const currentGroup = await AsyncStorage.getItem(`${STORAGE_GROUP_PREFIX}${group.id}`);
          if (new Date(group.lastUpdate) > (currentGroup ? new Date(JSON.parse(currentGroup).lastUpdate) : new Date(0))) {
            const groupDetails = await apiService.group.details(group.id);
            await AsyncStorage.setItem(`${STORAGE_GROUP_PREFIX}${group.id}`, JSON.stringify(groupDetails));
          }
        }),
      );

      setGroups(groups.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()));
    } catch (e) {
      console.warn("Erro ao buscar grupos no backend:", e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      //AsyncStorage.clear();
      const currentUser = await AsyncStorage.getItem(`${STORAGE_USER_PREFIX}`);
      if (currentUser) setUser(JSON.parse(currentUser));
      const storedGroups = await AsyncStorage.getItem(`${STORAGE_GROUP_PREFIX}all`);
      if (storedGroups) setGroups(JSON.parse(storedGroups));
      setShowSplash(false);
      const token = await getAccessToken();
      if (token) {
        try {
          await refreshUser();
          await refreshGroups();
          await initializePushNotifications();
        } catch {
          // TODO
        }
      } else {
        clearData();
      }
    })();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refreshGroups();
      }
    });

    return () => sub.remove();
  }, [initializePushNotifications, refreshGroups, refreshUser]);

  useEffect(() => {
    const query = collection(firestore, "refresh");
    const unsubscribe = onSnapshot(query, (_snapshot) => {
      /* TODO: Implement handling of the snapshot data
      const list: any = [];
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        list.push({ id: doc.id, ...doc.data() });
      });*/
      refreshGroups();
    });

    return () => unsubscribe();
  }, [refreshGroups]);

  if (showSplash) return <Text>Splash Screen</Text>;
  return (
    <AppContext.Provider
      value={{ loading, user, setUser, login, loginWithApple, logout, groups, setGroup, setGroupDetails, refreshGroup, removeGroup }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAuth must be used within AppProvider");
  return ctx;
}

export function useAuth() {
  const { loading, user, setUser, login, loginWithApple, logout } = useAppContext();
  return { loading, user, setUser, login, loginWithApple, logout };
}

export function useGroups() {
  const { groups, setGroup, setGroupDetails, refreshGroup, removeGroup } = useAppContext();
  return { groups, setGroup, setGroupDetails, refreshGroup, removeGroup };
}

export function useGroupData(groupId: string | number) {
  const { groups, setGroup, refreshGroup } = useAppContext();
  const [data, _setData] = useState<GroupDetail | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await AsyncStorage.getItem(`${STORAGE_GROUP_PREFIX}${groupId}`);
      if (!cancelled && stored) {
        _setData(JSON.parse(stored));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [groups, groupId]);

  type Updater = (prev: GroupDetail) => GroupDetail;

  const setData = useCallback(
    (updater: Updater) => {
      _setData((prev) => {
        if (!prev) return prev;

        const next = updater(prev);

        // Important: Schedule the provider update for the NEXT TICK,
        // never during the current render.
        setTimeout(() => {
          setGroup(groupId, next).catch((err) => {
            console.warn("Erro ao salvar grupo no provider:", err);
          });
        }, 0);

        return next;
      });
    },
    [groupId, setGroup],
  );

  const markAsRead = useCallback(() => {
    setData((current) => {
      const lastRead = new Date(current.lastReadAt ?? 0).getTime();
      const lastMsg = new Date(current.lastMessageAt ?? 0).getTime();

      if (lastRead >= lastMsg) return current;

      const updated: GroupDetail = {
        ...current,
        unreadCount: 0,
        lastReadAt: new Date().toISOString(),
      };

      apiService.group.markAsRead(Number(groupId)).catch((err) => {
        console.warn("Erro ao marcar como lido:", err);
      });

      return updated;
    });
  }, [groupId, setData]);

  const refresh = useCallback(async () => {
    const fresh = await refreshGroup(groupId);
    if (fresh) {
      _setData(fresh);
    }
  }, [groupId, refreshGroup]);

  return {
    data,
    setData,
    markAsRead,
    refresh,
  };
}
