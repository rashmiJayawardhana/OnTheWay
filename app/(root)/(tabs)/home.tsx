import React, { useEffect, useState, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
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
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.aviationstack.com/v1/flights?access_key=143514139749805c8c3d1c8c401fa489",
        );
        const data = await response.json();
        console.log("API Response:", data); // Log the data to check its structure
        setItems(data.data || []);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Search Term:", searchTerm);
  }, [searchTerm]);

  const filteredFlights = useMemo(() => {
    if (!searchTerm) return items; // Show all items if no search term is provided
    return items.filter((item) => {
      // Normalize all searchable fields and search term to lowercase
      const flightIata = item.flight?.iata?.toLowerCase() || "";
      const airlineName = item.airline?.name?.toLowerCase() || "";
      const departureAirport = item.departure?.airport?.toLowerCase() || "";
      const searchQuery = searchTerm.toLowerCase();

      // Check if any of the fields contain the search term
      return (
        flightIata.includes(searchQuery) ||
        airlineName.includes(searchQuery) ||
        departureAirport.includes(searchQuery)
      );
    });
  }, [items, searchTerm]);

  useEffect(() => {
    console.log("Filtered Flights:", filteredFlights);
  }, [filteredFlights]);

  const currentItems = useMemo(() => {
    // Show all filtered flights when searching, ignoring pagination
    return searchTerm
      ? filteredFlights
      : filteredFlights.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredFlights, searchTerm, page, itemsPerPage]);

  const totalPages = searchTerm
    ? 1 // If searching, treat as single-page data
    : Math.ceil(filteredFlights.length / itemsPerPage);

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

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const itemImages = [
    images.flight13,
    images.flight12,
    images.flight11,
    images.flight14,
    images.flight15,
    images.flight16,
    images.flight17,
    images.flight18,
    images.flight19,
    images.flight20,
    images.flight21,
    images.flight22,
    images.flight23,
    images.flight24,
    images.flight25,
  ];

  const renderFlightItem = ({ item, index }: { item: any; index: number }) => {
    // Get the image for the flight based on the index, looping through itemImages
    const imageIndex = (page - 1) * itemsPerPage + index; // Adjust index calculation to consider pagination
    const flightImage = itemImages[imageIndex % itemImages.length];

    const codesharedFlight = item.flight?.codeshared
      ? `${item.flight.codeshared.airline_name}, Flight ${item.flight.codeshared.flight_iata}`
      : "None";

    return (
      <TouchableOpacity onPress={increment}>
        <View className="px-5 py-3 bg-gray-200 mb-5 rounded-lg">
          {/* Image */}
          <Image
            source={flightImage} // Use the dynamically selected image
            className="w-full h-40 rounded-lg mb-3"
            resizeMode="cover"
          />
          {/* Flight Information */}
          <View className="flex flex-row items-center">
            <MaterialIcons name="flight" size={20} color="black" />
            <Text className="font-bold text-lg ml-2">
              {item.flight.iata || "Unknown Flight"}
            </Text>
          </View>
          <Text>Airline Name: {item.airline?.name || "Unknown"}</Text>
          <Text>Codeshared Flight: {codesharedFlight}</Text>

          {/* Departure Details */}
          <Text className="mt-3 font-bold">Departure Details:</Text>
          <Text>Airport: {item.departure?.airport || "Unknown"}</Text>
          <Text>IATA Code: {item.departure?.iata || "N/A"}</Text>
          <Text>
            Terminal: {item.departure?.terminal || "N/A"}, Gate:{" "}
            {item.departure?.gate || "N/A"}
          </Text>
          <Text>Scheduled Time: {item.departure?.scheduled || "N/A"}</Text>
          <Text>Estimated Time: {item.departure?.estimated || "N/A"}</Text>

          {/* Arrival Details */}
          <Text className="mt-3 font-bold">Arrival Details:</Text>
          <Text>Airport: {item.arrival?.airport || "Unknown"}</Text>
          <Text>IATA Code: {item.arrival?.iata || "N/A"}</Text>
          <Text>
            Terminal: {item.arrival?.terminal || "N/A"}, Gate:{" "}
            {item.arrival?.gate || "N/A"}
          </Text>
          <Text>Baggage Claim: {item.arrival?.baggage || "N/A"}</Text>
          <Text>Scheduled Time: {item.arrival?.scheduled || "N/A"}</Text>
          <Text>Estimated Time: {item.arrival?.estimated || "N/A"}</Text>

          {/* Flight Status */}
          <Text className="mt-3 font-bold">Flight Status:</Text>
          <Text>Status: {item.flight_status || "Unknown"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      {/* List of flights */}
      <FlatList
        data={currentItems}
        renderItem={renderFlightItem}
        keyExtractor={(item, index) => item[0]?.toString() || `flight-${index}`}
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
                <Image source={icons.out} className="w-6 h-6" />
              </TouchableOpacity>
            </View>
            <View className="px-5 py-3">
              <TextInput
                placeholder="Search by flight name"
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="bg-white rounded-lg px-4 py-2 border border-gray-300 placeholder:text-gray-400"
              />
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
          disabled={page === 1 || !!searchTerm} // Disable if on first page or searching
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
          disabled={page === totalPages || !!searchTerm}
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
