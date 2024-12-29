import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import { fetchAPI } from "@/lib/fetch";

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("SecureStore save item error:", err);
    }
  },
};

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    // Start the OAuth flow
    const { createdSessionId, setActive, signUp, user } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home"), // Ensure proper redirect
    });

    if (createdSessionId && setActive) {
      // Activate the session
      await setActive({ session: createdSessionId });

      // If a new user is created, optionally send user data to your API
      if (signUp?.createdUserId) {
        const fullName = user?.username?.trim() || "User"; // Use username or fallback to "Guest"
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: fullName,
            email: user?.emailAddress || "",
            clerkId: signUp.createdUserId,
          }),
        });
      }

      return {
        success: true,
        code: "success",
        message: "You have successfully signed in with Google",
        user: {
          name: user?.username || user?.emailAddress || "User",
          email: user?.emailAddress,
          id: user?.id,
        },
      };
    }

    // Return failure message if session activation or user data is missing
    return {
      success: false,
      code: "error",
      message: "Failed to sign in with Google. Please try again.",
    };
  } catch (err: any) {
    console.error("Google OAuth Error:", err);
    return {
      success: false,
      code: err?.code || "error",
      message: err?.errors?.[0]?.longMessage || "An unexpected error occurred.",
    };
  }
};
