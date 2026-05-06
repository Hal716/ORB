import * as Notifications from "expo-notifications";
import { initializeClasses, initializeTasks } from "@/constants/data";
import "@/global.css";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function RootLayoutContent() {
  const { isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  const [dataHydrated, setDataHydrated] = useState(false);

  const [fontsLoaded] = useFonts({
    "Sans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Sans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Sans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Sans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "Sans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Sans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Sans-Coopbl": require("../assets/fonts/COOPBL.ttf"),
  });
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true, 
      shouldShowList: true,   
    }),
  });
  useEffect(() => {
    if (!authLoaded) return;
  
    if (!user) {
      // Not logged in, nothing to hydrate
      setDataHydrated(true);
      return;
    }
  
    // Logged in, hydrate data
    const currentUserId = user.id;
    (async () => {
      try {
        await initializeClasses(currentUserId);
        await initializeTasks(currentUserId);
        if (currentUserId === user.id) setDataHydrated(true);
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setDataHydrated(true);
      }
    })();
  }, [authLoaded, user]);

  useEffect(() => {
    if (fontsLoaded && authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoaded]);
  
  if (!fontsLoaded || !authLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY!}
      options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <RootLayoutContent />
      </ClerkProvider>
    </PostHogProvider>
  );
}
