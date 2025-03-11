import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import * as Location from 'expo-location';
import axios from 'axios';
import { db } from '../Firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useTheme } from './ThemeContext';  // Import useTheme from ThemeContext

const BusStopsScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();  // Access isDarkMode state
  const [selectedMode, setSelectedMode] = useState('BusStop');
  const [weather, setWeather] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'busStops'));
        const busStopsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          latitude: parseFloat(doc.data().latitude),  // Convert to number
          longitude: parseFloat(doc.data().longitude), // Convert to number
        }));
        setBusStops(busStopsData);
      } catch (error) {
        console.error('Error fetching bus stops from Firestore:', error);
      }
    };

    const fetchLocationAndWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = userLocation.coords;
        setUserLocation({ latitude, longitude });

        const locationResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (locationResponse.length > 0) {
          setLocationDetails(locationResponse[0]);
        }

        const weatherResponse = await axios.get(
          `http://api.weatherapi.com/v1/current.json?key=f3ff6d04c96747d9b68100825251201&q=${latitude},${longitude}&aqi=no`
        );
        setWeather(weatherResponse.data);
      } catch (error) {
        console.error('Error fetching location or weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusStops();
    fetchLocationAndWeather();
  }, []);

  // Function to calculate distance using the Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Sort bus stops by distance
  const sortedBusStops = userLocation
    ? [...busStops].map((busStop) => ({
        ...busStop,
        distance: calculateDistance(userLocation.latitude, userLocation.longitude, busStop.latitude, busStop.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
    : busStops;

  const openMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderBusStopItem = ({ item }) => (
    <View style={[styles.busStopItem, isDarkMode && styles.darkBusStopItem]}>
      <View style={styles.busStopInfo}>
        <Text style={[styles.busStopName, isDarkMode && styles.darkText]}>{item.name}</Text>
        <Text style={[styles.busStopLocation, isDarkMode && styles.darkText]}>Distance: {item.distance.toFixed(2)} km</Text>
      </View>
      <TouchableOpacity
        style={[styles.busStopAction, isDarkMode && styles.darkButton]}
        onPress={() => openMap(item.latitude, item.longitude)}
      >
        <Text style={styles.busStopActionText}>View on Map</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkMode]}>
      <Header
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        weather={weather}
        locationDetails={locationDetails}
        navigation={navigation}
      />

      <Text style={[styles.busStopsText, isDarkMode && styles.darkText]}>Nearest Bus Stops</Text>

      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? "#98FB98" : "#228B22"} style={styles.loader} />
      ) : (
        <FlatList
          data={sortedBusStops}
          renderItem={renderBusStopItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.busStopsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background for light mode
    paddingTop: 40,
  },
  darkMode: {
    backgroundColor: '#1E1E1E', // Dark background for dark mode
  },
  busStopsList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  busStopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // White background for bus stop items
    borderRadius: 25,
    marginVertical: 10,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  darkBusStopItem: {
    backgroundColor: '#444', // Darker background for bus stop items in dark mode
  },
  busStopInfo: {
    flex: 1,
    marginRight: 15,
  },
  busStopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222', // Dark text color
  },
  darkText: {
    color: '#EEE', // Light text color for dark mode
  },
  busStopLocation: {
    fontSize: 17,
    color: '#555', // Medium dark text color
    marginTop: 5,
    fontWeight: '600',
  },
  busStopAction: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: '#228B22', // Green color
    borderRadius: 12,
  },
  darkButton: {
    backgroundColor: '#98FB98', // Lighter green color
  },
  busStopActionText: {
    color: '#FFFFFF', // White text color
    fontWeight: 'bold',
    fontSize: 17,
  },
  busStopsText: {
    fontSize: 26,
    fontWeight: '800',
    marginLeft: 30,
    marginBottom: 15,
    marginTop: 20,
    color: '#333', // Dark text color
    textTransform: 'uppercase',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BusStopsScreen;