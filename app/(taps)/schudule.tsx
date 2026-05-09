import { CLASSES } from "@/constants/data";
import "@/global.css";
import dayjs from "dayjs";
import { useFocusEffect, useRouter } from "expo-router";
import { styled } from "nativewind";
import {icons} from "@/constants/icons"
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const SafeAreaView = styled(URSafeAreaView);

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function SchudulePage() {
  const today = dayjs();
  const seticons = icons
  const [selectedDay, setSelectedDay] = useState(today.startOf("day"));
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const rangeStart = today.subtract(14, "day").startOf("week");
  const dayCardWidth = 80;
  const dayCardHight = 90;
  const dayCardMargin = 12;
  const currentWeekIndex = 14; // start at the current week center offset
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data when page comes into focus
  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const scheduleDays = Array.from({ length: 35 }).map((_, index) => {
    const day = rangeStart.add(index, "day");
    const items = CLASSES.filter(
      (item) => dayjs(item.date).day() === day.day(),
    ).sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

    return {
      day,
      items,
    };
  });

  const selectedItems = CLASSES.filter(
    (item) => dayjs(item.date).day() === selectedDay.day(),
  ).sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

  useEffect(() => {
    const offset = currentWeekIndex * (dayCardWidth + dayCardMargin);
    scrollViewRef.current?.scrollTo({ x: offset, animated: false });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Image
        source={seticons.idk}
        className="absolute opacity-5"
        style={{ top: -180, right: -300, }}
        resizeMode="contain"
      />
      <StatusBar style="dark" />
      <Image
        source={seticons.netflix}
        className="absolute w-14 h-14 opacity-10"
        style={{ bottom: 120, left: 20, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.adobe}
        className="absolute w-14 h-14 opacity-10"
        style={{ bottom: 80, left: 110, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.github}
        className="absolute w-14 h-14 opacity-10"
        style={{ bottom: 120, right: 0, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.canva}
        className="absolute w-20 h-24 opacity-10"
        style={{ bottom: 60, right: 80, transform: [{ rotate: '-25deg' }] }}
        resizeMode="contain"
      />
      <View className="p-5 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-Coopbl text-primary">This week</Text>
          <Text className="auth-helper mt-1">{today.format("ddd, MMM D")}</Text>
        </View>
        <Pressable
          className="auth-button p-5"
          onPress={() => router.push("/add-class" as any)}
        >
          <Text className="auth-button-text">Add class</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {scheduleDays.map(({ day }, index) => {
          const isSelected = day.isSame(selectedDay, "day");
          const isToday = day.isSame(today, "day");
          return (
            <Pressable
              key={index}
              onPress={() => setSelectedDay(day)}
              className={`mr-3 items-center rounded-3xl border px-4 py-3 ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : isToday
                    ? "border-accent bg-btest"
                    : "border-border bg-card"
              }`}
              style={{
                width: dayCardWidth,
                minWidth: dayCardWidth,
                height: dayCardHight,
              }}
            >
              <Text className="text-sm font-sans-semibold text-muted-foreground">
                {weekdays[day.day()]}
              </Text>
              <Text
                className={`text-xl font-sans-bold ${isSelected ? "text-primary" : isToday ? "text-accent" : "text-primary"}`}
              >
                {day.format("D")}
              </Text>
              <Text className="text-xs font-sans-medium text-muted-foreground mt-1">
                {day.format("MMM")}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerClassName="pb-24 pt-5 px-5">
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="auth-label">
              {selectedDay.format("dddd, MMM D")}
            </Text>
            <Text className="auth-helper">{selectedItems.length} classes</Text>
          </View>

          {selectedItems.length > 0 ? (
            selectedItems.map((item, classIndex) => {
              // Find the global index of this class in CLASSES array
              const globalIndex = CLASSES.findIndex(
                (cls) => cls.name === item.name && cls.date === item.date,
              );
              return (
                <View
                  key={`${item.name}-${classIndex}`}
                  className="auth-card mb-3 rounded-3xl p-4"
                  style={{ backgroundColor: item.color ?? "#fff" }}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text
                      className="text-lg font-Coopbl text-subprimary flex-1"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Pressable
                        className="auth-secondary-button"
                        onPress={() =>
                          router.push(`/add-class?index=${globalIndex}` as any)
                        }
                      >
                        <Text className="auth-secondary-button-text">Edit</Text>
                      </Pressable>
                      <Text className="text-sm font-sans-semibold text-background">
                        {dayjs(item.date).format("hh:mm A")}
                      </Text>
                    </View>
                  </View>
                  <Text className="auth-helper">{item.instructor}</Text>
                  <Text className="auth-helper">{item.classroom}</Text>
                </View>
              );
            })
          ) : (
            <View className="rounded-3xl border border-border bg-card p-4">
              <Text className="auth-helper text-center">No classes</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
