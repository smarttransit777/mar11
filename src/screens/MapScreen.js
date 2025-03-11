import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Vibration, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { db } from '../Firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const GOOGLE_MAPS_APIKEY = "AIzaSyCZNsXmvcKmBuJ9JCqlk2a2hk8jGx_Dv_k"; // Replace with your actual API key

const MapScreen = ({ route }) => {
  const { busId, busName } = route.params;

  const [busLocation, setBusLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [busSpeed, setBusSpeed] = useState(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [screenLoading, setScreenLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Allow location access to track the bus.");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    };

    const fetchBusLocation = async () => {
      try {
        const busDoc = await getDoc(doc(db, 'buses', busId));
        if (busDoc.exists()) {
          const busData = busDoc.data();
          if (busData.current_location?.latitude && busData.current_location?.longitude) {
            const newBusLocation = {
              latitude: busData.current_location.latitude,
              longitude: busData.current_location.longitude,
            };
            setBusLocation(newBusLocation);
            setBusSpeed(busData.speed || 50);
          }
        } else {
          Alert.alert("Error", "Bus not found!");
        }
      } catch (error) {
        console.error("Error fetching bus location", error);
      }
    };

    const loadData = async () => {
      await getUserLocation();
      await fetchBusLocation();
      setScreenLoading(false);
    };

    loadData();
    const interval = setInterval(fetchBusLocation, 5000);
    return () => clearInterval(interval);
  }, [busId]);

  useEffect(() => {
        if (busLocation && userLocation) {
            const dist = getDistance(busLocation, userLocation);
            setDistance(dist.toFixed(2));

            let calculatedEta;

            if (dist <= 0.1) {
                calculatedEta = "Arrived";
                if (!showAlert) {
                    setShowAlert(true);
                    Vibration.vibrate();
                    Speech.speak("The bus has arrived at your location!");
                }
            } else if (dist > 0.1 && dist <= 1) {
                calculatedEta = "2 mins";
            } else {
                const avgSpeed = busSpeed ? parseFloat(busSpeed) : 50;
                const etaInMinutes = Math.round((dist / avgSpeed) * 60);
                calculatedEta = `${etaInMinutes} mins`;
            }

            setEta(calculatedEta);

            if (dist <= 0.2 && !showAlert && dist > 0.1) {
                setShowAlert(true);
                Vibration.vibrate();
                Speech.speak("The bus is within 200 meters of your location!");
            }
        }
    }, [busLocation, userLocation, busSpeed, showAlert]);

    const getDistance = (coord1, coord2) => {
        const R = 6371;
        const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
        const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(coord1.latitude * (Math.PI / 180)) * Math.cos(coord2.latitude * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

  const lightMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {screenLoading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : busLocation && userLocation ? (
        <>
          <Text style={styles.title}>{busName} Location</Text>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={lightMapStyle}
            style={styles.map}
            region={{ latitude: busLocation.latitude, longitude: busLocation.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          >
            <Marker coordinate={busLocation} title={busName} pinColor="red" />
            <Marker coordinate={userLocation} title="You" pinColor="blue" />
            <MapViewDirections
              origin={userLocation} // Origin changed to user location
              destination={busLocation} // Destination changed to bus location
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor="blue"
              optimizeWaypoints={true}
            />
          </MapView>
          <Text style={styles.infoText}>Distance: {distance ? `${distance} km` : 'Calculating...'}</Text>
          <Text style={styles.infoText}>ETA: {eta ? eta : 'Calculating...'}</Text>
        </>
      ) : (
        <Text style={styles.error}>Failed to fetch locations</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: "80%",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#000",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
});

export default MapScreen;