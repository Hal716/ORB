import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/expo";
import { useCallback } from "react";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const { startSSOFlow } = useSSO();

  const signInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  }, []);

  return { signInWithGoogle };
}