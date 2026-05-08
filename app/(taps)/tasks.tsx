import { TASKS } from "@/constants/data";
import "@/global.css";
import { deleteTaskRowFromAppwrite } from "@/lib/appwrite";
import { saveTasks } from "@/lib/utility";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useFocusEffect, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { icons } from "@/constants/icons";


const SafeAreaView = styled(URSafeAreaView);

export default function TasksPage() {
  const router = useRouter();
  const { user } = useUser();
  const seticons = icons
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh task list when page comes into focus
  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const handleDelete = async (index: number) => {
    Alert.alert("Remove task", "Are you sure you want to remove this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const rowId = TASKS[index]?.appwriteRowId;
          try {
            if (rowId) {
              await deleteTaskRowFromAppwrite(rowId);
            }
          } catch (e) {
            console.error(e);
            Alert.alert(
              "Delete failed",
              "Could not delete this task from Appwrite. Check your connection and try again.",
            );
            return;
          }
          TASKS.splice(index, 1);
          setRefreshKey((prev) => prev + 1);
          await saveTasks(TASKS, user!.id);
        },
      },
    ]);
  };

  const getPriorityColor = (priorityLevel: "Low" | "Medium" | "High") => {
    switch (priorityLevel) {
      case "High":
        return "#ff4444";
      case "Medium":
        return "#ffaa00";
      case "Low":
        return "#44aa44";
      default:
        return "#cccccc";
    }
  };

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
        source={seticons.youtube}
        className="absolute w-24 h-24 opacity-10"
        style={{ bottom: 120, left: 20, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.discord}
        className="absolute w-20 h-20 opacity-10"
        style={{ bottom: 80, left: 110, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.amazon}
        className="absolute w-18 h-18 opacity-10"
        style={{ bottom: 120, right: 0, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.windows}
        className="absolute w-26 h-26 opacity-10"
        style={{ bottom: 60, right: 80, transform: [{ rotate: '-25deg' }] }}
        resizeMode="contain"
      />
      <ScrollView contentContainerClassName="pb-20">
        <View className="p-5 flex-row items-center justify-between">
          <Text className="text-3xl font-Coopbl text-primary">Tasks</Text>
          <Pressable
            className="auth-button p-5"
            onPress={() => router.push("/add-task" as any)}
          >
            <Text className="auth-button-text">Add Task </Text>
          </Pressable>
        </View>

        <View className="auth-card">
          {TASKS.length > 0 ? (
            TASKS.map((item, index) => (
              <View
                key={`${item.name}-${index}-${refreshKey}`}
                className="auth-card mb-4 border-l-4"
                style={{ borderLeftColor: getPriorityColor(item.priority) }}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="font-Coopbl text-subprimary text-lg">
                      {item.name}
                    </Text>
                    <Text className="auth-helper">{item.subject}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <View
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getPriorityColor(item.priority),
                        }}
                      />
                      <Text className="auth-helper text-xs">
                        {item.priority}
                      </Text>
                    </View>
                    <Text className="auth-helper mt-1">
                      Due: {dayjs(item.dueDate).format("MMM D, YYYY h:mm A")}
                    </Text>
                  </View>
                  <View className="flex-col justify-between">
                    <Pressable
                      className="auth-secondary-button mb-2"
                      onPress={() => router.push(`/add-task?index=${index}` as any)}
                    >
                      <Text className="auth-secondary-button-text">Edit</Text>
                    </Pressable>
                    <Pressable
                      className="auth-secondary-button"
                      onPress={() => handleDelete(index)}
                    >
                      <Text className="auth-secondary-button-text">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="auth-helper text-center">
              No tasks yet. Add one to get started.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
