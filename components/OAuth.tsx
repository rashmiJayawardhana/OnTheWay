import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    try {
      // Start OAuth flow and handle the result
      const result = await googleOAuth(startOAuthFlow);

      // Debugging log
      console.log("OAuth Result:", result);

      if (result.success && result.user) {
        const username = result.user.name || "User"; // Fallback if name is not available

        Alert.alert("Success", "Redirecting to home screen.");
        // Redirect to home screen
        router.replace({
          pathname: "/(root)/(tabs)/home",
          params: { username },
        });
      } else {
        Alert.alert(
          "Error",
          result.message || "Sign-in failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Log In with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
