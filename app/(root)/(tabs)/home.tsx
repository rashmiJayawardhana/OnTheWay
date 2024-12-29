import React, { useState } from "react";
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
  Platform,
  Button,
  Keyboard,
  NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { create } from "zustand";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
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

// Define TypeScript interfaces for types
interface Flight {
  num: string;
  departure?: { [key: string]: string }[];
  arrival?: { [key: string]: string }[];
}

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

// Function to get an image index based on flight number
const getFlightImageIndex = (flightNumber: string) => {
  const flightNumberInt = parseInt(flightNumber, 10);
  return isNaN(flightNumberInt) ? 0 : flightNumberInt % itemImages.length;
};

export default function Home() {
  const { username } = useLocalSearchParams(); // Extract username from params
  console.log("Username:", username);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(1); // Current page
  const [itemsPerPage] = useState(5); // Items per page
  const { clickCount, increment } = useStore();
  const { signOut } = useAuth();

  // Form state
  const [flightNumber, setFlightNumber] = useState("");
  const [airlineName, setAirlineName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (
    event: NativeSyntheticEvent<DateTimePickerEvent>,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Fetch data from the API
  const fetchFlights = async () => {
    if (!flightNumber || !airlineName || !date) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const apiKey = "67715aef4cfc5a8e1200ddd5"; // Replace with your API key
    setLoading(true);

    try {
      // Format date to YYYYMMDD
      const formattedDate = date.toISOString().split("T")[0].replace(/-/g, ""); // Remove hyphens from the date

      // Correct API endpoint
      const response = await fetch(
        `https://api.flightapi.io/airline/${apiKey}?num=${flightNumber}&name=${airlineName}&date=${formattedDate}`,
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      // Log the response to the console
      console.log("API Response:", JSON.stringify(data, null, 2));
      setFlights(data || []);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to fetch flight data.");
    } finally {
      setLoading(false);
    }
  };

  // Preprocess flight data to combine departure and arrival
  const preprocessFlightData = (data: any[]) => {
    const flights = [];

    const departures = data.flatMap((item) => item.departure || []);
    const arrivals = data.flatMap((item) => item.arrival || []);

    for (let i = 0; i < Math.min(departures.length, arrivals.length); i++) {
      flights.push({
        departure: departures[i],
        arrival: arrivals[i],
      });
    }

    return flights;
  };

  const processedData = preprocessFlightData(flights); // Use the state data

  // Get the current items to display based on the page
  const currentItems = processedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // Calculate total pages based on the number of items
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  // Handle Load More
  const loadMore = () => {
    if (page * itemsPerPage < processedData.length) {
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

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between my-5 mx-5">
        <Text className="text-3xl capitalize font-JakartaExtraBold">
          Welcome, {username}! 👋
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
        >
          <Image source={icons.out} className="w-8 h-8" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View className="bg-white p-5 rounded-lg shadow mb-4 mt-2 m-5">
        <Text className="text-2xl font-bold mb-4">Flight Tracking Form</Text>
        <Text className="mb-2">Flight Number</Text>
        <TextInput
          placeholder="Enter Flight Number (e.g., 2459)"
          value={flightNumber}
          onChangeText={setFlightNumber}
          className="border border-gray-300 p-2 rounded mb-3 placeholder:text-gray-400"
        />
        <Text className="mb-2">Airline Name</Text>
        <TextInput
          placeholder="Enter Airline Name (e.g., AA)"
          value={airlineName}
          onChangeText={setAirlineName}
          className="border border-gray-300 p-2 rounded mb-3 placeholder:text-gray-400"
        />
        {/* Date Input with Calendar */}
        <Text className="mb-2">Date</Text>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss(); // Dismiss the keyboard when opening the date picker
            setShowDatePicker(true);
          }}
        >
          <TextInput
            className="border border-gray-300 p-2 rounded mb-3 placeholder:text-gray-400"
            placeholder="Select date"
            value={date.toDateString()} // Display the selected date as a string
            editable={false} // Make the input non-editable to prevent keyboard from showing
          />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false); // Hide the date picker after selection
              if (selectedDate) {
                setDate(selectedDate); // Update the selected date
              }
            }}
          />
        )}

        <TouchableOpacity
          onPress={fetchFlights}
          className="bg-blue-500 p-3 rounded"
        >
          <Text className="text-white text-center">Fetch Flights</Text>
        </TouchableOpacity>
      </View>

      {/* Flight List */}
      <FlatList
        data={currentItems}
        keyExtractor={(item, index) => `flight-${index}`}
        ListHeaderComponent={
          <>
            <Text className="text-2xl font-bold mb-3 mt-2 mx-2">
              Flight Results
            </Text>
            {/* Only one image displayed here */}
            <Image
              source={itemImages[getFlightImageIndex(flightNumber)]}
              className="w-full h-40 rounded-lg mb-3"
              resizeMode="cover"
            />
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <View className="items-center justify-center mt-4">
              <Image
                source={images.noResult}
                className="w-40 h-40"
                resizeMode="contain"
              />
              <Text>No flights found</Text>
            </View>
          )
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={increment}>
            <View className="px-5 py-3 bg-gray-200 mb-5 rounded-lg m-4">
              <View className="flex flex-row items-center">
                <MaterialIcons name="flight" size={20} color="black" />
                <Text className="font-bold ml-2 text-xl mb-2">
                  Flight Leg {index + 1}
                </Text>
              </View>
              {/* Departure Section */}
              <Text className="text-lg font-bold mb-2">Departure</Text>
              <View className="mb-2">
                <Text>Status: {item.departure["Status:"] || "N/A"}</Text>
                <Text>Airport: {item.departure["Airport:"] || "N/A"}</Text>
                <Text>
                  Scheduled Time: {item.departure["Scheduled Time:"] || "N/A"}
                </Text>
                <Text>
                  Terminal - Gate: {item.departure["Terminal - Gate:"] || "N/A"}
                </Text>
              </View>
              {/* Arrival Section */}
              <Text className="text-lg font-bold mt-4 mb-2">Arrival</Text>
              <View className="mb-2">
                <Text>Status: {item.arrival["Status:"] || "N/A"}</Text>
                <Text>Airport: {item.arrival["Airport:"] || "N/A"}</Text>
                <Text>
                  Scheduled Time: {item.arrival["Scheduled Time:"] || "N/A"}
                </Text>
                <Text>
                  Terminal - Gate: {item.arrival["Terminal - Gate:"] || "N/A"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
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
