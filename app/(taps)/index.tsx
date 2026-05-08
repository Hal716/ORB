import HomeSchudule from "@/components/HomeSchudule";
import ListHeading from "@/components/ListHeading";
import Tasks from "@/components/Tasks";
import { CLASSES, HOME_USER, TASKS } from "@/constants/data";
import "@/global.css";
import { icons } from "@/constants/icons";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useFocusEffect, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useCallback, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
// import * as Notifications from 'expo-notifications';

const SafeAreaView = styled(URSafeAreaView);


export default function App() {
  const router = useRouter();
  const { user } = useUser();
  const  seticons = icons;
  const displayName = user?.username ?? user?.firstName ?? HOME_USER.name;
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data when page comes into focus
  useFocusEffect(
    useCallback(() => {
      // Force component to re-render by updating refresh key
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  return (
    
    <SafeAreaView className="flex-1 bg-background p-5">
      <Image
        source={seticons.idk}
        className="absolute opacity-5"
        style={{ top: -180, right: -300, }}
        resizeMode="contain"
      />
      <StatusBar style="dark" />
      <Image
        source={seticons.github}
        className="absolute w-14 h-14 opacity-10"
        style={{ bottom: 120, left: 20, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.blackgo}
        className="absolute w-20 h-20 opacity-10"
        style={{ bottom: 80, left: 95, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.openai}
        className="absolute w-14 h-14 opacity-10"
        style={{ bottom: 120, right: 0, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.dropbox}
        className="absolute w-24 h-24 opacity-10"
        style={{ bottom: 60, right: 50, transform: [{ rotate: '-25deg' }] }}
        resizeMode="contain"
      />
      <View>
        <FlatList
          key={`tasks-${refreshKey}`}
          data={TASKS}
          ListHeaderComponent={() => (
            <>
              <View className="flex-row items-center space-x-2 mb-6">
                <Text className="test1">Hello </Text>
                <Text className="test mr-2">{displayName} 👋</Text>
                <Text className="mt-4">{dayjs().format("hh:mm A")}</Text>
              </View>

              <View>
                <ListHeading title="Up Coming Classes" />

                <FlatList
                  key={`classes-${refreshKey}`}
                  data={CLASSES}
                  renderItem={({ item }) => <HomeSchudule {...item} />}
                  keyExtractor={(item) => item.date}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={<Text>No Upcoming Class Today</Text>}
                  contentContainerClassName=""
                />
              </View>

              <View className="m-6" />
  
              <ListHeading title="Tasks" />
            </>
          )}
          renderItem={({ item }) => <Tasks {...item} />}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          ListEmptyComponent={<Text>No Tasks for Now</Text>}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerClassName="pb-30"
        />
      </View>
    </SafeAreaView>
  );
}
