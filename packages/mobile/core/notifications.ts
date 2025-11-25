import Constants from "expo-constants";
import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(onReceived?: (notification: Notifications.Notification) => Promise<void>) {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
  }

  if (onReceived) Notifications.addNotificationReceivedListener(async (notification) => await onReceived(notification));

  return token?.data;
}

export function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    const response = Notifications.getLastNotificationResponse();
    if (isMounted && response?.notification) {
      handle(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      handle(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

async function handle(notification: Notifications.Notification) {
  const data = notification.request.content.data;
  await Notifications.setBadgeCountAsync(0);
  switch (data?.type) {
    /*
    case NotificationType.inbox: router.push(`/summary/group/${data?.group}?refresh=true&tab=0&inbox=true`); break;
    case NotificationType.groupMessage: router.push(`/summary/group/${data?.group}?refresh=true&tab=1&inbox=false`); break;
    case NotificationType.groupDrawn:
    case NotificationType.groupJoining:
    case NotificationType.groupLeaving:
    case NotificationType.groupClosed:
    case NotificationType.giftListUpdated:
    case NotificationType.inviteFriends:
    case NotificationType.drawGroup:
    case NotificationType.groupDetailsUpdated: router.push(`/summary/group/${data?.group}?refresh=true&tab=0&inbox=false`); break;
    case NotificationType.participantRemoved:
      */
    default:
      router.push("/?refresh=true");
      break;
  }
}
