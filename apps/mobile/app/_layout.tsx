import { AppProvider, useAuth } from "@/components/provider";
import { isDevClient, isExpoGo } from "@/core/utils";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import "react-native-reanimated";

function RootNavigator() {
  useEffect(() => {
    if (isExpoGo || isDevClient) return;
    async function updateApp() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log("Update check failed:", e);
      }
    }

    updateApp();
  }, []);

  const colorScheme = useColorScheme();
  const { user } = useAuth();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="create-group" options={{ headerShown: false }} />
          <Stack.Screen name="group/info" options={{ headerShown: false }} />
          <Stack.Screen name="group/details" options={{ headerShown: false }} />
          <Stack.Screen name="group/update" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <KeyboardAvoidingView style={{ flex: 1, paddingBottom: 12 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <RootNavigator />
      </KeyboardAvoidingView>
    </AppProvider>
  );
}
