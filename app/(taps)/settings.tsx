import { HOME_USER } from "@/constants/data";
import "@/global.css";
import { useAuth, useUser } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import { Alert, Image, Pressable, Text, Modal, TextInput, TouchableOpacity, View, Switch } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useProfilePicture } from '@/hooks/ChangeProfPic';
import { useUpdateUsername } from '@/hooks/updateusername';
import { EditUsernameModal } from '@/components/EditUsernameModal';
import { useState } from "react";
import { icons } from "@/constants/icons"  

const SafeAreaView = styled(URSafeAreaView);


export default function SettingsPage() {
  const [editUsernameVisible, setEditUsernameVisible] = useState(false);
  const { updateUsername, isLoading } = useUpdateUsername();
  const { updateProfilePicture } = useProfilePicture();
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const displayName = user?.username ?? user?.firstName ?? "Guest";
  const seticons = icons
  const emailAddress =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "Not available";

  const handleEditUsername = async () => {
    let newUsername = "";
    Alert.prompt(
      "Change Username",
      "Enter your new username:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            if (newUsername.trim().length === 0) {
              Alert.alert("Error", "Username cannot be empty.");
              return;
            }

            try {
              await user?.update({
                username: newUsername.trim(),
              });
              HOME_USER.name = newUsername.trim();
              Alert.alert("Success", "Username updated successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to update username.");
              console.error(error);
            }
          },
        },
      ],
      "plain-text",
      displayName,
    );
  };
  const deleteAccount = async () => {
    await user?.delete();
  };

  return (
    <SafeAreaView
      className="bg-background flex-1"
    >
      <Image
        source={seticons.idk}
        className="absolute opacity-5"
        style={{ top: -180, right: -300, }}
        resizeMode="contain"
      />
      <StatusBar style="dark" />
      <Image
        source={seticons.facebook}
        className="absolute w-24 h-24 opacity-10"
        style={{ bottom: 120, left: 20, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.twiter}
        className="absolute w-20 h-20 opacity-10"
        style={{ bottom: 80, left: 110, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.claude}
        className="absolute w-18 h-18 opacity-10"
        style={{ bottom: 120, right: 0, transform: [{ rotate: '10deg' }] }}
        resizeMode="contain"
      />
      <Image
        source={seticons.telegram}
        className="absolute w-26 h-26 opacity-10"
        style={{ bottom: 60, right: 80, transform: [{ rotate: '-25deg' }] }}
        resizeMode="contain"
      />
      <View className="auth-card">
        {user ? (
          <>
            <View className="items-center mb-6 auth-field">
                  {user.imageUrl ? (
                    <Image
                      source={{ uri: user.imageUrl }}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <View className="auth-logo-mark">
                      <Text className="auth-logo-mark-text">
                        {displayName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
            </View>
            <View className="auth-field">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="auth-label">Name</Text>
                  <Text className="auth-helper">{displayName}</Text>
                </View>
                  <EditUsernameModal
                    visible={editUsernameVisible}
                    onClose={() => setEditUsernameVisible(false)}
                    currentName={displayName}
                  />
                  <Pressable onPress={() => setEditUsernameVisible(true)} className="ml-3">
                    <Image
                      source={require("@/assets/icons/edit.png")}
                      className="w-6 h-6"
                    />
                  </Pressable>
              </View>
            </View>
            <View className="auth-field">

            </View>
            <View className="auth-field">
              <Text className="auth-label mt-5">Email</Text>
              <Text className="auth-helper mb-5">{emailAddress}</Text>
              <Text className="auth-label mt-5">About Us</Text>
              <View className="flex-row mb-5">
                <Image source={seticons.github} className="w-6 h-6 mr-2">
                </Image>
                <Link href={"https://github.com/Hal716"}><Text className="font-Sans-ExtraBold text-taps">GitHup</Text>
                </Link>
                </View>
                <View className="flex-row mb-5">

                <Image source={seticons.web} className="w-7 h-7 mr-2">
                </Image>
                <Link href={"https://hamza.shoqi.net"}><Text className="font-Sans-ExtraBold text-taps">Website</Text>
                </Link>
              </View>
            </View>
            <Pressable className="auth-button" 
            onPress={() =>
              Alert.alert("Delete Account", "Are you sure you want to Delete your account?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Account",
                  style: "destructive",
                  onPress: async () => {
                    await deleteAccount();
                    router.replace({ pathname: "/(auth)/sign-in" as any });
                  },
                },
              ])
            }
            >
              <Text className="auth-button-text">Delete Account</Text>
            </Pressable>
            
            <Pressable
              className="auth-button "
              onPress={() =>
                Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                      await signOut();
                      router.replace({ pathname: "/(auth)/sign-in" as any });
                    },
                  },
                ])
              }
              >
              <Text className="auth-button-text">Sign Out</Text>
            </Pressable>
          </>
        ) : (
          <View className="auth-form">
            <Text className="auth-title">No account signed in</Text>
            <Text className="auth-helper mt-2">
              Please sign in to view account details.
            </Text>
            <Pressable
              className="auth-secondary-button mt-4"
              onPress={() => {
                /* navigation handled by Link below */
              }}
              >
              <Link href={{ pathname: "/(auth)/sign-in" as any }}>
                <Text className="auth-secondary-button-text">
                  Go to Sign In
                </Text>
              </Link>
            </Pressable>
          </View>
        )}
      </View>

      <View className="mt-6 items-center">
        <Link href="/" className="auth-link">
          <Text className="auth-link">Go Back</Text>
        </Link>
      </View>
      <Text className="m-7">© 2026 ORB App.</Text>  
    </SafeAreaView>
  );
}
