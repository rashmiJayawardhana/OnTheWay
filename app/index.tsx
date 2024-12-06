import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Index = () => {
  const { isLoaded, isSignedIn } = useAuth();

  // Ensure authentication state is fully loaded before making a decision
  if (!isLoaded) return null; // Show nothing or a loading spinner while auth state is loading

  // Redirect based on authentication status
  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default Index;
