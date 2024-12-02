import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
};

export default RootLayout;
