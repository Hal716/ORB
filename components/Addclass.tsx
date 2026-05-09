import * as Notifications from "expo-notifications";
import { CLASSES, TASKS } from "@/constants/data";
import "@/global.css";
import {
  deleteClassRowFromAppwrite,
  saveClassToAppwrite,
  updateClassRowInAppwrite,
} from "@/lib/appwrite";
import { saveClasses } from "@/lib/utility";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import ColorPicker from "react-native-wheel-color-picker";
import Slider from '@react-native-community/slider';
import tinycolor from 'tinycolor2';

const SafeAreaView = styled(URSafeAreaView);
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


export default function Addclass() {
  const router = useRouter();
  const { user } = useUser();
  const { index } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [classroom, setClassroom] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([dayjs().day()]);
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [endHour, setEndHour] = useState(9);
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("AM");
  const [color, setColor] = useState("#f5c542");
  const [brightness, setBrightness] = useState(1);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const adjustedColor = tinycolor(color).lighten((brightness - 1) * 50).toString();

  // Load class data if editing
  useEffect(() => {
    if (index !== undefined) {
      const classIndex = Number(index);
      if (!isNaN(classIndex) && CLASSES[classIndex]) {
        const item = CLASSES[classIndex];
        const itemDate = dayjs(item.date);
        setName(item.name);
        setInstructor(item.instructor);
        setClassroom(item.classroom ?? "");
        setSelectedDays([itemDate.day()]);
        const itemHour = itemDate.hour();
        setPeriod(itemHour >= 12 ? "PM" : "AM");
        setHour(itemHour % 12 === 0 ? 12 : itemHour % 12);
        setMinute(itemDate.minute().toString().padStart(2, "0"));
        setColor(item.color ?? "#f5c542");
        setEditingIndex(classIndex);

        // Load end time if it exists
        if (item.endDate) {
          const endDate = dayjs(item.endDate);
          const endH = endDate.hour();
          setEndPeriod(endH >= 12 ? "PM" : "AM");
          setEndHour(endH % 12 === 0 ? 12 : endH % 12);
          setEndMinute(endDate.minute().toString().padStart(2, "0"));
        const requestPermissions = async () => {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission required', 'Please enable notifications in settings.');
          }
        };
        requestPermissions();
        
        }
      }
    }
  }, [index]);

  const resetForm = () => {
    setName("");
    setInstructor("");
    setClassroom("");
    setSelectedDays([dayjs().day()]);
    setHour(8);
    setMinute("00");
    setPeriod("AM");
    setEndHour(9);
    setEndMinute("00");
    setEndPeriod("AM");
    setColor("#f5c542");
    setEditingIndex(null);
  };

  
  
  const scheduleClassAlarm = async (
    classItem: {
      name: string;
      instructor: string;
      classroom?: string;
      date: string;
      color?: string;
      endDate?: string; 
      appwriteRowId?: string;
      notificationId?: string;
    }
  ) => {
    
    const classDate = dayjs(classItem.date)
  
  
    const notifyHour = classDate.subtract(10, 'minute').hour();
    const notifyMinute = classDate.subtract(10, 'minute').minute();
  
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Class in 10 minutes!',
        body: `${classItem.name} — ${classItem.classroom}`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,  // 👈 repeats every week
        weekday: classDate.day() + 1, // Expo uses 1=Sun, 2=Mon... dayjs uses 0=Sun
        hour: notifyHour,
        minute: notifyMinute,
      },
    });
  
    return notificationId;
  };

  const buildDateForWeekday = (weekdayValue: number) => {
    const rawHour = Number(hour);
    const rawMinute = Number(minute);
    const safeHour = isNaN(rawHour) ? 8 : Math.min(Math.max(rawHour, 1), 12);
    const safeMinute = isNaN(rawMinute) ? 0 : Math.min(Math.max(rawMinute, 0), 59);
    const selectedHour = period === "AM" ? safeHour % 12 : (safeHour % 12) + 12;
  
    let target = dayjs()
      .day(weekdayValue)
      .hour(selectedHour)
      .minute(safeMinute)
      .second(0);
  
    // Only push to next week if the weekday itself is already past this week
    // (not if just the time has passed today)
    if (weekdayValue < dayjs().day()) {
      target = target.add(7, "day");
    }
  
    return target.toISOString();
  };

  

  const buildEndDateForWeekday = (weekdayValue: number) => {
    const rawHour = Number(endHour);
    const rawMinute = Number(endMinute);
    const safeHour = isNaN(rawHour) ? 9 : Math.min(Math.max(rawHour, 1), 12);
    const safeMinute = isNaN(rawMinute)
      ? 0
      : Math.min(Math.max(rawMinute, 0), 59);
    const selectedHour =
      endPeriod === "AM" ? safeHour % 12 : (safeHour % 12) + 12;

    let target = dayjs()
      .day(weekdayValue)
      .hour(selectedHour)
      .minute(safeMinute)
      .second(0);
    if (target.isBefore(dayjs())) {
      target = target.add(7, "day");
    }
    return target.toISOString();
  };

  const handleSave = async () => {
    if (!name.trim() || !instructor.trim() || !classroom.trim()) {
      Alert.alert(
        "Missing information",
        "Please fill out all fields before saving.",
      );
      return;
    }
    if (editingIndex !== null && CLASSES[editingIndex]?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        CLASSES[editingIndex].notificationId
      );
    }

    const daysToSave =
      selectedDays.length > 0 ? selectedDays : [dayjs().day()];

    const newClasses = daysToSave.map((weekdayValue) => ({
      name: name.trim(),
      instructor: instructor.trim(),
      classroom: classroom.trim(),
      date: buildDateForWeekday(weekdayValue),
      endDate: buildEndDateForWeekday(weekdayValue),
      color: color.trim() || "#f5c542",
    }));
    const classesWithNotifications = await Promise.all(
      newClasses.map(async (item) => {
        const notificationId = await scheduleClassAlarm(item);
    
        return {
          ...item,
          notificationId,
        };
      }),
    );
    if (!user?.id) {
      Alert.alert("Authentication required", "Please sign in again.");
      return;
    }

    try {
      const previousAppwriteRowId =
        editingIndex !== null
          ? CLASSES[editingIndex]?.appwriteRowId
          : undefined;
      const useInPlaceUpdate =
        editingIndex !== null &&
        Boolean(previousAppwriteRowId) &&
        newClasses.length === 1;

      if (editingIndex !== null) {
        CLASSES.splice(editingIndex, 1, ...newClasses);
      } else {
        CLASSES.push(...newClasses);
      }

      const localSaved = await saveClasses(CLASSES, user.id);
      if (!localSaved) {
        throw new Error("Could not save classes locally.");
      }

      let merged;

      if (useInPlaceUpdate) {
        const item = newClasses[0];
        await updateClassRowInAppwrite({
          rowId: previousAppwriteRowId,
          name: item.name,
          instructor: item.instructor,
          date: item.date,
          classroom: item.classroom ?? "",
          color: item.color ?? "#f5c542",
          userId: user.id,
          endDate: item.endDate,
        });
        merged = [{ ...item, appwriteRowId: previousAppwriteRowId }];
      } else {
        if (previousAppwriteRowId) {
          try {
            await deleteClassRowFromAppwrite(previousAppwriteRowId);
          } catch (e) {
            console.warn(
              "Could not remove previous class row from Appwrite:",
              e,
            );
          }
        }

        const createdRows = await Promise.all(
          newClasses.map((item) =>
            saveClassToAppwrite({
              name: item.name,
              instructor: item.instructor,
              date: item.date,
              classroom: item.classroom ?? "",
              color: item.color ?? "#f5c542",
              userId: user.id,
              endDate: item.endDate,
            }),
          ),
        );

        merged = newClasses.map((item, i) => ({
          ...item,
          appwriteRowId: createdRows[i].$id,
        }));
      }

      if (editingIndex !== null) {
        CLASSES.splice(editingIndex, merged.length, ...merged);
      } else {
        const start = CLASSES.length - newClasses.length;
        merged.forEach((c, i) => {
          CLASSES[start + i] = c;
        });
      }

      await saveClasses(CLASSES, user.id);

      Alert.alert(
        "Success",
        editingIndex !== null
          ? "Class updated and synced to Appwrite."
          : "Class added and synced to Appwrite.",
      );
      resetForm();
      router.back();
    } catch (error) {
      console.error("Failed to save class:", error);
      Alert.alert(
        "Save failed",
        "Class could not be synced to Appwrite. Please verify your database and table IDs in .env.",
      );
    }
  };

  const handleCancel = () => {
    resetForm();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView contentContainerClassName="pb-20">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-3xl font-Coopbl text-primary">
            {editingIndex !== null ? "Edit class" : "Add Class"}
          </Text>
          <Pressable onPress={handleCancel}>
            <Text className="text-lg text-primary">✕</Text>
          </Pressable>
        </View>

        <View className="auth-card mb-6">
          <Text className="auth-helper mb-4">
            Create a new class with schedule and color.
          </Text>

          <View className="auth-field">
            <Text className="auth-label">Class name</Text>
            <TextInput
              className="auth-input"
              placeholder="e.g. CS 211"
              placeholderTextColor="#666666"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="auth-field">
            <Text className="auth-label">Teacher</Text>
            <TextInput
              className="auth-input"
              placeholder="Choose teacher"
              placeholderTextColor="#666666"
              value={instructor}
              onChangeText={setInstructor}
            />
          </View>

          <View className="auth-field">
            <Text className="auth-label">Classroom</Text>
            <TextInput
              className="auth-input"
              placeholder="e.g. C259"
              placeholderTextColor="#666666"
              value={classroom}
              onChangeText={setClassroom}
            />
          </View>

          <View className="auth-field">
            <Text className="auth-label">Weekdays</Text>
            <View className="flex-row flex-wrap gap-2">
              {weekdays.map((day, index) => {
                const dayIndex = index as number;
                const isSelected = selectedDays.includes(dayIndex);
                return (
                  <Pressable
                    key={day}
                    onPress={() => {
                      setSelectedDays((prev) => {
                        const selected = prev.includes(dayIndex)
                          ? prev.filter((item) => item !== dayIndex)
                          : [...prev, dayIndex];
                        return selected.sort((a, b) => a - b);
                      });
                    }}
                    className={`rounded-2xl px-3 py-2 border ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <Text
                      className={`text-sm font-sans-semibold ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Start Time */}
          <View className="auth-field">
            <Text className="auth-label">Start Time</Text>
            <View className="flex-row items-start gap-2">
              <View className="flex-1">
                <Text className="auth-label mb-2">Hour</Text>
                <TextInput
                  className="auth-input"
                  placeholder="HH"
                  placeholderTextColor="#666666"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={hour.toString()}
                  onChangeText={(value) => {
                    const numeric = Number(value.replace(/[^0-9]/g, ""));
                    setHour(isNaN(numeric) ? 0 : numeric);
                  }}
                />
              </View>
              <View className="flex-1">
                <Text className="auth-label mb-2">Minute</Text>
                <TextInput
                  className="auth-input"
                  placeholder="MM"
                  placeholderTextColor="#666666"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={minute}
                  onChangeText={(value) => {
                    const numeric = value.replace(/[^0-9]/g, "");
                    setMinute(numeric.slice(0, 2));
                  }}
                />
              </View>
            </View>
            <View className="flex-row gap-2 mt-3">
              {(["AM", "PM"] as const).map((periodValue) => (
                <Pressable
                  key={periodValue}
                  onPress={() => setPeriod(periodValue)}
                  className={`rounded-2xl px-4 py-2 border ${
                    period === periodValue
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <Text
                    className={`text-sm ${period === periodValue ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {periodValue}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* End Time */}
          <View className="auth-field">
            <Text className="auth-label">End Time</Text>
            <View className="flex-row items-start gap-2">
              <View className="flex-1">
                <Text className="auth-label mb-2">Hour</Text>
                <TextInput
                  className="auth-input"
                  placeholder="HH"
                  placeholderTextColor="#666666"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={endHour.toString()}
                  onChangeText={(value) => {
                    const numeric = Number(value.replace(/[^0-9]/g, ""));
                    setEndHour(isNaN(numeric) ? 0 : numeric);
                  }}
                />
              </View>
              <View className="flex-1">
                <Text className="auth-label mb-2">Minute</Text>
                <TextInput
                  className="auth-input"
                  placeholder="MM"
                  placeholderTextColor="#666666"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={endMinute}
                  onChangeText={(value) => {
                    const numeric = value.replace(/[^0-9]/g, "");
                    setEndMinute(numeric.slice(0, 2));
                  }}
                />
              </View>
            </View>
            <View className="flex-row gap-2 mt-3">
              {(["AM", "PM"] as const).map((periodValue) => (
                <Pressable
                  key={periodValue}
                  onPress={() => setEndPeriod(periodValue)}
                  className={`rounded-2xl px-4 py-2 border ${
                    endPeriod === periodValue
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <Text
                    className={`text-sm ${endPeriod === periodValue ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {periodValue}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="auth-field">
            <Text className="auth-label">Color</Text>
            <View style={{ width: '100%' }}>
              <ColorPicker
                color={color}
                onColorChange={setColor}
                onColorChangeComplete={setColor}
                thumbSize={30}
                sliderSize={20}
                noSnap={true}
                row={false}
                shadeSliderThumb
                
              />
              <Text className="text-sm text-muted-foreground mt-2">
                Selected: {color}
              </Text>
            </View>
          </View>

          <Pressable className="auth-button mt-6" onPress={handleSave}>
            <Text className="auth-button-text">
              {editingIndex !== null ? "Save changes" : "Add class"}
            </Text>
          </Pressable>

          <Pressable
            className="auth-secondary-button mt-3"
            onPress={handleCancel}
          >
            <Text className="auth-secondary-button-text">Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}