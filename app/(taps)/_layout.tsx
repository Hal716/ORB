import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import "@/global.css";
import { useAuth } from "@clerk/expo";
import { clsx } from "clsx";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const tabBar = components.tabBar;

const TabLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const Insests = useSafeAreaInsets();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    <Redirect href={{ pathname: "/(auth)/sign-in" as any }} />
  }

  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
          <Image source={icon} className="tabs-glyph " />
        </View>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(Insests.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          elevation: 0,
        },

        tabBarItemStyle: {
          padding: tabBar.height / 2 - tabBar.iconFrame / 1.3,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontWeight: "bold",
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: "center",
        },
      }}
    >
      {tabs.map((tab: { name: string; title: string; icon: any }) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
