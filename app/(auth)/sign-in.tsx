import { Alert, Image, ScrollView, Text, View } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useCallback } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";
import useForm from "@/hooks/useForm";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  // Validation rules for SignIn
  const validationRules = {
    name: { required: true, errorMessage: "Username is required" },
    password: {
      required: true,
      minLength: 6,
      errorMessage: "Password must be at least 6 characters",
    },
  };

  const { form, errors, handleInputChange, validateForm } = useForm(
    { name: "", password: "" },
    validationRules,
  );

  const onSignInPress = useCallback(async () => {
    if (!validateForm()) return; // Validate form before submission

    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.name,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace({
          pathname: "/(root)/(tabs)/home",
          params: { username: form.name },
        });
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign-In Error:", err);
      const errorMessage =
        err?.errors?.[0]?.longMessage || "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    }
  }, [isLoaded, form.name, form.password]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.flight2} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-white font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Username"
            placeholder="Enter Your Username"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => handleInputChange("name", value)}
            error={errors.name}
          />
          <InputField
            label="Password"
            placeholder="Enter Your Password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => handleInputChange("password", value)}
            error={errors.password}
          />
          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Don't have an account?</Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
