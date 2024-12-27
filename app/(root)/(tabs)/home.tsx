import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { create } from "zustand";
import { icons, images } from "@/constants";

// Zustand store with proper typing
interface StoreState {
  clickCount: number;
  increment: () => void;
}

const useStore = create<StoreState>((set) => ({
  clickCount: 0,
  increment: () =>
    set((state) => ({
      ...state, // Ensure all properties are preserved
      clickCount: state.clickCount + 1,
    })),
}));

export default function Home() {
  const { username = "User" } = useLocalSearchParams(); // Extract username from params
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { clickCount, increment } = useStore();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setItems(data.products || []);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSignOut = () => {};

  return (
    <SafeAreaView className="bg-general-500">
      {/* List of items */}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={increment}>
            <View className="px-5 py-3 bg-gray-200 mb-3 rounded-lg">
              <Image
                source={{
                  uri: item.thumbnail || "https://via.placeholder.com/150",
                }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
              <Text className="font-bold">{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>
                Status: {item.stock > 0 ? "Available" : "Unavailable"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl capitalize font-JakartaExtraBold">
                Welcome{", "}
                {username}!{""} 👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No data found</Text>
              </>
            )}
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      />

      {/* Floating Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#0286FF",
          padding: 15,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
        }}
        onPress={increment}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{clickCount}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
