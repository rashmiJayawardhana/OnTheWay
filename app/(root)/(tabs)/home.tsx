import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
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
import { useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
  const { username } = useLocalSearchParams(); // Extract username from params
  console.log("Username:", username);
  const [items, setItems] = useState<any[]>([]); // All items
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(1); // Current page
  const [itemsPerPage] = useState(5); // Items per page
  const { clickCount, increment } = useStore();
  const { signOut } = useAuth();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://opensky-network.org/api/states/all",
        );
        const data = await response.json();
        console.log("API Response:", data); // Log the data to check its structure
        setItems(data.states || []); // Assuming `states` is the correct key
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get the current items to display based on the page
  const currentItems = items.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // Handle Load More
  const loadMore = () => {
    if (page * itemsPerPage < items.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle page change (for pagination buttons)
  const goToPage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Calculate total pages based on the number of items
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      {/* List of flights */}
      <FlatList
        data={currentItems}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={increment}>
            <View className="px-5 py-3 bg-gray-200 mb-5 rounded-lg">
              <View className="flex flex-row items-center">
                <MaterialIcons name="flight" size={20} color="black" />
                <Text className="font-bold ml-2">
                  {item[1] || "Unknown Flight"}
                </Text>
              </View>
              {/* Display flight name*/}
              <Text>Origin: {item[2] || "Unknown"}</Text>
              {/* Display origin*/}
              <Text>Status: {item[9] ? "In Flight" : "On Ground"}</Text>
              {/* Flight status */}
              <Text>Altitude: {item[5] || "N/A"} meters</Text>
              {/* Altitude */}
              <Text>Speed: {item[10] || "N/A"} km/h</Text>
              {/* Speed */}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item[0]?.toString() || Math.random().toString()} // Use the flight ID as key
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5 mx-5">
              <Text className="text-2xl capitalize font-JakartaExtraBold">
                Welcome, {username}! 👋
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
                  alt="No recent flights found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No flights found</Text>
              </>
            )}
          </View>
        )}
        onEndReached={loadMore} // Load more when user reaches the bottom
        onEndReachedThreshold={0.5} // Trigger when the user is 50% from the bottom
        contentContainerStyle={{
          paddingBottom: 10,
        }}
      />

      {/* Pagination Bar */}
      <View className="flex flex-row items-center justify-center space-x-4 my-3 gap-x-2">
        <TouchableOpacity
          onPress={() => goToPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 rounded-lg flex items-center justify-center"
          style={{ width: 90 }}
        >
          <Text className="text-white text-center">Previous</Text>
        </TouchableOpacity>
        <Text className="text-lg">
          {page} / {totalPages}
        </Text>
        <TouchableOpacity
          onPress={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 rounded-lg flex items-center justify-center"
          style={{ width: 90 }} // Same width for the Next button
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>

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
