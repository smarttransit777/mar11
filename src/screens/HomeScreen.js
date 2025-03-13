import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, Text, SafeAreaView, StatusBar, Switch, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../Firebase/firebase';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import Header from '../components/Header';
import { useTheme } from './ThemeContext';  // Import useTheme from ThemeContext

const GOOGLE_MAPS_APIKEY = "AIzaSyCZNsXmvcKmBuJ9JCqlk2a2hk8jGx_Dv_k"; // Replace with your actual API key

const HomeScreen = ({ navigation }) => {
    const { isDarkMode, setIsDarkMode } = useTheme(); // Access theme from context
    const [weather, setWeather] = useState(null);
    const [locationDetails, setLocationDetails] = useState(null);
    const [buses, setBuses] = useState([]);
    const [filteredBuses, setFilteredBuses] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedMode, setSelectedMode] = useState('HomeScreen');
    const [seatCountsByBusId, setSeatCountsByBusId] = useState({});  // Renamed for clarity
    const [sortedBuses, setSortedBuses] = useState([]);  // New state for sorted buses

    const dynamicStyles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 40,
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5',
            paddingBottom: 20,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 15,
            backgroundColor: isDarkMode ? '#333' : '#FFFFFF',
            paddingVertical: 10,
            borderRadius: 15,
            marginHorizontal: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 6,
        },
        logoName: {
            width: 240,
            height: 60,
            resizeMode: 'contain',
        },
        busStopsText: {
            fontSize: 26,
            fontWeight: '800',
            marginLeft: 30,
            marginBottom: 15,
            marginTop: 20,
            color: isDarkMode ? '#EEE' : '#333',
            textTransform: 'uppercase',
        },
        busList: {
            paddingHorizontal: 15,
        },
        busItemContainer: {
            borderRadius: 25,
            marginVertical: 10,
            overflow: 'hidden',
            position: 'relative',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
        },
        busItemContent: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 18,
            backgroundColor: isDarkMode ? '#444' : '#fff',
            borderRadius: 25,
        },
        busArrow: {
            padding: 14,
            marginRight: 25,
            backgroundColor: isDarkMode ? '#555' : '#eee',
            borderRadius: 12,
        },
        busInfo: {
            flex: 1,
        },
        busName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#222',
        },
        busText: {
            fontSize: 17,
            color: isDarkMode ? '#ccc' : '#555',
            fontWeight: '600',
        },
        seatStatus: {
            fontSize: 17,
            color: isDarkMode ? '#fff' : '#444',
            fontWeight: '700',
        },
        darkModeSwitchContainer: {
            alignItems: 'flex-end',
            paddingHorizontal: 30,
            marginBottom: 12,
        },
        darkModeSwitchLabel: {
            fontSize: 16,
            color: isDarkMode ? '#ccc' : '#555',
            marginRight: 8,
        },
        arrivalTimeText: {
            fontSize: 16,
            color: isDarkMode ? '#ccc' : '#555',
            fontWeight: '600',
        },
        availableSeatsText: {
            fontSize: 16,
            color: isDarkMode ? '#98FB98' : '#228B22',
            fontWeight: '600',
        },
        scrollContent: {  // Add style for ScrollView content
            flexGrow: 1,
        },
        busArrivedText: { // Style for "Bus Arrived" text
            fontSize: 16,
            color: 'red', // Red color
            fontWeight: '600',
        },
        occupancyContainer: {  // Added container for the bus visual
            width: 40,
            height: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#888',
            overflow: 'hidden',
            marginLeft: 5,
            backgroundColor: '#eee', // Light background
        },
        occupancyFill: {
            height: '100%',
            backgroundColor: 'green', // Default green color
        },
        occupancyStatus: { // added styling
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        lessBusy: {  // added style for "Less Busy"
            backgroundColor: 'green',
        },
        busy: {  // added style for "Busy"
            backgroundColor: 'yellow',
            color: 'black' // Important for visibility on yellow background
        },
        overcrowded: {  // added style for "Overcrowded"
            backgroundColor: 'red',
        },
    });

    const [dynamicStyle, setDynamicStyle] = useState(dynamicStyles); // Define Dynamic Style to set for isDarkMode and save into usestate on render

    useEffect(() => {
        setDynamicStyle(dynamicStyles); // Set new Dynamic Style on every change
    }, [isDarkMode]);


    useEffect(() => {
        const getUserLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error("Permission to access location was denied");
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (error) {
                console.error("Error getting user location", error);
            }
        };

        getUserLocation();
    }, []);

   useEffect(() => {
    const fetchBuses = async () => {
        try {
            // Create a query to fetch buses only with status "Running"
            const busesRef = collection(db, 'buses');
            const q = query(busesRef, where('status', '==', 'Running')); // filter bus status to Running

            const querySnapshot = await getDocs(q);
            const busesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setBuses(busesList);
        } catch (error) {
            console.error('Error fetching buses:', error);
        }
    };

        fetchBuses();
        const interval = setInterval(fetchBuses, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchBusSeats = async () => {
            try {
                const seatsCollection = collection(db, 'buses_seat');

                const unsubscribe = onSnapshot(seatsCollection, (snapshot) => {  // Use onSnapshot
                    const seatsData = {};
                    snapshot.forEach(doc => {
                        seatsData[doc.id] = doc.data().count;
                    });
                    setSeatCountsByBusId(seatsData);
                }, (error) => {
                    console.error('Error listening to bus seats:', error);
                });

                return () => unsubscribe(); // Unsubscribe when component unmounts

            } catch (error) {
                console.error('Error fetching bus seats:', error);
            }
        };

        fetchBusSeats();
    }, []);


    const weatherIconMap = {
        Sunny: 'weather-sunny',
        'Partly cloudy': 'weather-partly-cloudy',
        Cloudy: 'weather-cloudy',
        Rain: 'weather-rainy',
        Thunderstorm: 'weather-lightning',
        Snow: 'weather-snowy',
        Fog: 'weather-fog',
    };

    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }

                const userLocation = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = userLocation.coords;

                const locationResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (locationResponse.length > 0) {
                    setLocationDetails(locationResponse[0]);
                }

                const weatherResponse = await axios.get(
                    `http://api.weatherapi.com/v1/current.json?key=f3ff6d04c96747d9b68100825251201&q=${latitude},${longitude}&aqi=no`
                );
                setWeather(weatherResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLocationAndWeather();
    }, []);

    const getDistance = (coord1, coord2) => {
        if (!coord1 || !coord2) return null;
        const R = 6371;
        const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
        const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(coord1.latitude * (Math.PI / 180)) * Math.cos(coord2.latitude * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    useEffect(() => {
        if (locationDetails && userLocation && buses.length > 0) {
            const calculateDistanceAndETA = (bus) => {
                const distance = getDistance(bus.current_location, userLocation);
                let eta = null;
    
                if (distance !== null) {
                    if (distance <= 0.1) {
                        eta = "Arrived";
                    } else if (distance > 0.1 && distance <= 1) {
                        eta = "2 mins";
                    } else {
                        const avgSpeed = bus.speed ? parseFloat(bus.speed) : 50;
                        const etaInMinutes = Math.round((distance / avgSpeed) * 60);
                        eta = `${etaInMinutes} mins`;
                    }
                }
                return { ...bus, distance, eta };
            };
    
            const relevantWords = Object.values(locationDetails)
                .join(' ')
                .toLowerCase()
                .replace(/,/g, '')
                .split(/\s+/);
    
            const filtered = buses.filter((bus) => {
                if (Array.isArray(bus.major_cities)) {
                    const citiesArray = bus.major_cities.flatMap(city =>
                        city.split(',').map(cityName => cityName.trim().toLowerCase())
                    );
    
                    return relevantWords.some(word => citiesArray.includes(word));
                }
                return false;
            });
    
            const busesWithDistanceAndETA = filtered.map(calculateDistanceAndETA);
    
            const sorted = busesWithDistanceAndETA.sort((a, b) => {
                if (a.distance === null) return 1;
                if (b.distance === null) return -1;
                return (a.distance || Infinity) - (b.distance || Infinity);
            });
    
            setFilteredBuses(sorted);
    
            // ✅ New Logic Added Here
            const userCoords = {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
            };
    
            const updatedBuses = filtered
                .map((bus) => {
                    if (bus.current_location?.latitude && bus.current_location?.longitude) {
                        const busCoords = {
                            latitude: bus.current_location.latitude,
                            longitude: bus.current_location.longitude,
                        };
                        // Calculate distance using haversine
                        const distance = haversine(userCoords, busCoords) / 1000; // Convert meters to KM
                        return { ...bus, distance };
                    }
                    return bus;
                })
                .filter(
                    (bus) =>
                        bus.distance !== undefined &&
                        bus.distance > 0.05 && // Remove buses within 50m
                        bus.occupancy !== 'not available'
                )
                .sort((a, b) => a.distance - b.distance); // Sort by nearest distance
    
            setFilteredBuses(updatedBuses);
        }
    }, [locationDetails, userLocation, buses]);
    
    const renderBusItem = ({ item }) => {
        const seatsTaken = seatCountsByBusId[item.id] ? Number(seatCountsByBusId[item.id]) : 0;
        let availableSeats = Math.max(0, 50 - seatsTaken);
        availableSeats = availableSeats > 50 ? 0 : availableSeats; // Ensure availableSeats never goes negative or above 50

        const totalSeats = 50;
        const distance = item.distance;

        let etaDisplay;
        if (item.eta === "Arrived") {
            etaDisplay = <Text style={dynamicStyles.busArrivedText}>Bus Arrived</Text>;
        } else {
            etaDisplay = item.eta ? `ETA: ${item.eta}` : 'ETA: Not available';
        }

        let occupancyStatus = null;
        let occupancyStyle = {};

        if (seatCountsByBusId[item.id] !== undefined) {
            if (availableSeats > 20) {
                occupancyStatus = 'Less Busy';
                occupancyStyle = dynamicStyle.lessBusy;
            } else if (availableSeats > 0 && availableSeats <= 20) {
                occupancyStatus = 'Busy';
                occupancyStyle = dynamicStyle.busy;
            } else {
                occupancyStatus = 'Overcrowded';
                occupancyStyle = dynamicStyle.overcrowded;
            }
        } else {
            occupancyStatus = 'Less Busy';
            occupancyStyle = dynamicStyle.lessBusy;
        }

        return (
            <View style={dynamicStyle.busItemContainer}>
                <View style={dynamicStyle.busItemContent}>
                    <TouchableOpacity
                        style={dynamicStyle.busArrow}
                        onPress={() => navigation.navigate('MapScreen', { busId: item.id, busName: item.bus_name })}
                    >
                        <FontAwesome name="map-marker" size={30} color={isDarkMode ? '#98FB98' : '#228B22'} />
                    </TouchableOpacity>
                    <View style={dynamicStyle.busInfo}>
                        <Text style={dynamicStyle.busName}>{item.bus_name}</Text>
                        <Text style={dynamicStyles.busText}>Bus Number: {item.bus_number}</Text>
                        <Text style={dynamicStyles.busText}>Route: {item.route}</Text>

                        <Text style={dynamicStyles.arrivalTimeText}>
                            {etaDisplay}
                        </Text>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={dynamicStyles.availableSeatsText}>
                                Available Seats: {availableSeats} / {totalSeats}
                            </Text>
                            {occupancyStatus && (
                                <Text style={[
                                    dynamicStyle.occupancyStatus,
                                    occupancyStyle
                                ]}>
                                    {occupancyStatus}
                                </Text>
                            )}

                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={dynamicStyle.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={dynamicStyle.container.backgroundColor} />

            <View style={dynamicStyle.logoContainer}>
                <Image source={require('../../assets/logoname.png')} style={dynamicStyle.logoName} />
            </View>

            <View style={dynamicStyle.darkModeSwitchContainer}>
                <Text style={dynamicStyle.darkModeSwitchLabel}>Dark Mode</Text>
                <Switch
                    trackColor={{ false: '#7986CB', true: '#9FA8DA' }}
                    thumbColor={isDarkMode ? '#303F9F' : '#E8EAF6'}
                    ios_backgroundColor="#3F51B5"
                    onValueChange={setIsDarkMode}
                    value={isDarkMode}
                />
            </View>
            <ScrollView contentContainerStyle={dynamicStyle.scrollContent}>
                {/* Pass isDarkMode prop to Header */}
                <Header
                    weather={weather}
                    locationDetails={locationDetails}
                    weatherIconMap={weatherIconMap}
                    selectedMode={selectedMode}
                    onModeChange={setSelectedMode}
                    navigation={navigation}
                    isDarkMode={isDarkMode}  // Pass the isDarkMode state
                />
                <Text style={dynamicStyle.busStopsText}>Available Buses</Text>

                <FlatList
                    data={filteredBuses}
                    renderItem={renderBusItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={dynamicStyle.busList}
                    scrollEnabled={false}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;