import "@/global.css";
import { icons } from "@/constants/icons"
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const SafeAreaView = styled(URSafeAreaView);

export default function SignUpPage() {
  const seticons = icons;
  const { signInWithGoogle } = useGoogleAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
      username,
      firstName: username,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signUp.status === "missing_requirements") {
      await signUp.verifications.sendEmailCode();
    }

    if (signUp.status === "complete") {
      await signUp.finalize();
      router.push("/");
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize();
      router.push("/");
    }
  };

  const needsVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  return (
    <SafeAreaView className="auth-screen">
      {/* background design */}
      <View className="absolute inset-0 overflow-hidden">
        <Image
          source={seticons.openai}
          className="absolute w-20 h-20 opacity-10"
          style={{ top: 150, left: 20, transform: [{ rotate: '-15deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.blackgo}
          className="absolute w-30 h-30 opacity-10"
          style={{ top: 80, left: 150, transform: [{ rotate: '-15deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.canva}
          className="absolute w-15 h-15 opacity-10"
          style={{ top: 210, left: 300, transform: [{ rotate: '-15deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.spotify}
          className="absolute w-16 h-16 opacity-10"
          style={{ top: 80, right: 30, transform: [{ rotate: '20deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.openai}
          className="absolute w-14 h-14 opacity-10"
          style={{ bottom: 60, left: 300, transform: [{ rotate: '10deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.github}
          className="absolute w-14 h-14 opacity-10"
          style={{ bottom: 40, left: 50, transform: [{ rotate: '10deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.dropbox}
          className="absolute w-24 h-24 opacity-10"
          style={{ bottom: 20, right: 150, transform: [{ rotate: '-25deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.notion}
          className="absolute w-15 h-15 opacity-10"
          style={{ bottom: 250, right: 0, transform: [{ rotate: '-25deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.netflix}
          className="absolute w-15 h-15 opacity-10"
          style={{ bottom: 500, right: 0, transform: [{ rotate: '-25deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.claude}
          className="absolute w-10 h-10 opacity-10"
          style={{ bottom: 360, left: 0, transform: [{ rotate: '-25deg' }] }}
          resizeMode="contain"
        />
        <Image
          source={seticons.orbb}
          className="absolute w-15 h-15 opacity-10"
          style={{ bottom: 600, right: 390, transform: [{ rotate: '-25deg' }] }}
          resizeMode="contain"
        />
      </View>
      <StatusBar style="dark" />
      <View className="">
        <Image
          source={require("@/assets/icons/orbblack.png")}
          className="w-30 h-30"
          resizeMode="contain"
        />
      </View>
      <View className="auth-content">
        <View className="auth-card">
          {needsVerification ? (
            <View className="auth-form">
              <Text className="auth-title">Verify your account</Text>
              <View className="auth-field">
                <TextInput
                  className="auth-input"
                  value={code}
                  placeholder="Enter your verification code"
                  placeholderTextColor="#666666"
                  onChangeText={setCode}
                  keyboardType="numeric"
                />
                {errors.fields.code && (
                  <Text className="auth-error">
                    {errors.fields.code.message}
                  </Text>
                )}
              </View>
              <Pressable
                className={`auth-button ${
                  fetchStatus === "fetching" ? "auth-button-disabled" : ""
                }`}
                onPress={handleVerify}
                disabled={fetchStatus === "fetching"}
              >
                <Text className="auth-button-text">Verify</Text>
              </Pressable>
              <Pressable
                className="auth-secondary-button"
                onPress={() => signUp.verifications.sendEmailCode()}
              >
                <Text className="auth-secondary-button-text">
                  I need a new code
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="auth-form">
              <Text className="auth-title mb-5">Sign up</Text>
              <View className="auth-field">
                <Text className="auth-label">Username</Text>
                <TextInput
                  className="auth-input"
                  autoCapitalize="none"
                  value={username}
                  placeholder="Enter username"
                  placeholderTextColor="#666666"
                  onChangeText={setUsername}
                />
                {errors.fields.username && (
                  <Text className="auth-error">
                    {errors.fields.username.message}
                  </Text>
                )}
              </View>
              <View className="auth-field">
                <Text className="auth-label">Email address</Text>
                <TextInput
                  className="auth-input"
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter email"
                  placeholderTextColor="#666666"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
                {errors.fields.emailAddress && (
                  <Text className="auth-error">
                    {errors.fields.emailAddress.message}
                  </Text>
                )}
              </View>
              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className="auth-input"
                  value={password}
                  placeholder="Enter password"
                  placeholderTextColor="#666666"
                  secureTextEntry
                  onChangeText={setPassword}
                />
                {errors.fields.password && (
                  <Text className="auth-error">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>
              <Pressable
                className={`auth-button ${
                  !username ||
                  !emailAddress ||
                  !password ||
                  fetchStatus === "fetching"
                    ? "auth-button-disabled"
                    : ""
                }`}
                onPress={handleSubmit}
                disabled={
                  !username ||
                  !emailAddress ||
                  !password ||
                  fetchStatus === "fetching"
                }
              >
                <Text className="auth-button-text">Sign up</Text>
              </Pressable>
              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-3 text-gray-500 text-sm">or</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>
                            
              {/* Google Sign Up */}
              <Pressable
                className="auth-secondary-button flex-row items-center justify-center gap-3"
                onPress={signInWithGoogle}
              >
                <Image
                  source={require("@/assets/icons/google.jpg")}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="auth-secondary-button-text">Continue with Google</Text>
              </Pressable>
              <View className="auth-link-row">
                <Text className="auth-link-copy">Already have an account?</Text>
                <Link href={{ pathname: "/(auth)/sign-in" as any }}>
                  <Text className="auth-link">Sign in</Text>
                </Link>
              </View>
              <View nativeID="clerk-captcha" />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
