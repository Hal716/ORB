import "@/global.css";
import { useSignIn, useUser } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, Text, TextInput, View, ScrollView } from "react-native";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { icons } from "@/constants/icons";
import { syncUserDataFromAppwrite } from "@/lib/utility";

const SafeAreaView = styled(URSafeAreaView);

export default function SignInPage() {
  const  seticons = icons;
  const { signInWithGoogle } = useGoogleAuth();
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const { user } = useUser();

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      identifier,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "needs_client_trust") {
      await signIn.mfa.sendEmailCode();
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize();
      if (user?.id) {
        await syncUserDataFromAppwrite(user.id);
      }
      router.push("/");
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize();
      if (user?.id) {
        await syncUserDataFromAppwrite(user.id);
      }
      router.push("/");
    }
  };

  return (
    <SafeAreaView className="auth-screen">
      <ScrollView>
          <StatusBar style="dark" />
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
          <View className="">
            <Image
              source={require("@/assets/icons/Vector.png")}
              className="m-5 w-25 h-30"
              resizeMode="contain"
            />
          </View>
          <View className="auth-content">
            <Text className="auth-title m-5">Welcome Back</Text>
            <View className="auth-card">
              {signIn.status === "needs_client_trust" ? (
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
                    onPress={() => signIn.mfa.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">
                      I need a new code
                    </Text>
                  </Pressable>
                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.reset()}
                  >
                    <Text className="auth-secondary-button-text">Start over</Text>
                  </Pressable>
                </View>
              ) : (
                <View className="auth-form">
                  <Text className="auth-hztitle mb-5">Sign in</Text>
                  <View className="auth-field">
                    <TextInput
                      className="auth-input"
                      autoCapitalize="none"
                      value={identifier}
                      placeholder="Enter email or username"
                      placeholderTextColor="#666666"
                      onChangeText={setIdentifier}
                      keyboardType="default"/>
                    {errors.fields.identifier && (
                      <Text className="auth-error">
                        {errors.fields.identifier.message}
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
                      onChangeText={setPassword}/>
                    {errors.fields.password && (
                      <Text className="auth-error">
                        {errors.fields.password.message}
                      </Text>
                    )}
                  </View>
                  <Pressable
                    className={`auth-button ${
                      !identifier || !password || fetchStatus === "fetching"
                        ? "auth-button-disabled"
                        : ""
                    }`}
                    onPress={handleSubmit}
                    disabled={
                      !identifier || !password || fetchStatus === "fetching"
                    }
                  >
                    <Text className="auth-button-text">Continue</Text>
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
                    <Text className="auth-link-copy">
                      Don't have an account?
                    </Text>
                    <Link href={{ pathname: "/(auth)/sign-up" as any }}>
                      <Text className="auth-link">Sign up</Text>
                    </Link>
                  </View>
                </View>
              )}
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}
