import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../screens/ThemeContext'; // Import useTheme

const weatherIconMap = {
  Sunny: 'weather-sunny',
  Clear: 'weather-sunny',
  'Partly cloudy': 'weather-partly-cloudy',
  Cloudy: 'weather-cloudy',
  Overcast: 'weather-cloudy',
  Mist: 'weather-fog',
  Fog: 'weather-fog',
  'Patchy rain possible': 'weather-partly-rainy',
  'Light rain': 'weather-rainy',
  Rain: 'weather-rainy',
  'Heavy rain': 'weather-pouring',
  Thunderstorm: 'weather-lightning',
  Snow: 'weather-snowy',
  'Heavy snow': 'weather-snowy-heavy',
};

const Header = ({ weather, locationDetails, selectedMode, onModeChange, navigation }) => {
  const { isDarkMode } = useTheme();  // Access isDarkMode state from ThemeContext
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const styles = StyleSheet.create({ // Use regular styles with isDarkMode
    headerContainer: {
      width: "100%",
      backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5',  // Dark Grey / Light Grey
      paddingVertical: 30,
      alignItems: "center",
      position: "relative",
    },
    locationBox: {
      backgroundColor: isDarkMode ? '#333' : '#fff',  // Darker Grey / White
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginBottom: 10,
    },
    locationDetail: {
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
      color: isDarkMode ? '#EEE' : '#333',  // Off-White / Dark Grey
    },
    weatherContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    temperature: {
      fontSize: 32,
      fontWeight: "bold",
      color: isDarkMode ? '#98FB98' : '#228B22',  // Pale Green/Forest Green
      marginLeft: 10,
    },
    loadingText: {
      color: isDarkMode ? '#eee' : 'black',
    },
    hamburgerIcon: {
      position: "absolute",
      top: 0,
      right: 15,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.3)", // Subtle overlay
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#333' : '#fff',  // Darker Grey / White
      padding: 20,
      width: 320,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    },
    modalHeader: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
      color: isDarkMode ? '#EEE' : '#333',  // Off-White / Dark Grey
    },
    transportModeWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 12,
      width: "100%",
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#444' : '#F8F8F8', // Mid-Dark Grey / White
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    activeMode: {
      backgroundColor: isDarkMode ? '#555' : '#E6F7FF', // Lighter Grey / Light Blue
    },
    modeLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: isDarkMode ? '#CCC' : '#333',  // Light Grey / Dark Grey
      marginLeft: 12,
    },
    activeModeLabel: {
      color: "#007AFF",  // Keep the Blue
    },
    closeButton: {
      marginTop: 20,
      paddingVertical: 8,
      paddingHorizontal: 20,
      backgroundColor: "#FF4D4D", // Red
      borderRadius: 6,
    },
    closeButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    hamburgerIconColor: {  //style to change color according to isDarkMode
      color: isDarkMode ? "white" : "black",
    },
  });

  const renderLocation = () => {
    if (!locationDetails) return <Text style={styles.loadingText}>Fetching location...</Text>;

    const { formattedAddress } = locationDetails;
    const addressParts = formattedAddress.split(",");
    const relevantAddress = addressParts.slice(0, 5).join(", ");

    return (
      <View style={styles.locationBox}>
        <Text style={styles.locationDetail}>
          {relevantAddress || "Unknown Location"}
        </Text>
      </View>
    );
  };

  const transportModes = [
    { id: "HomeScreen", label: "Home", icon: "home" },
    { id: "BusStop", label: "Bus Stops", icon: "bus" },
    { id: "Complaint", label: "Complaint", icon: "alert-circle" },
    { id: "EmergencyCall", label: "Emergency Call", icon: "phone" },
  ];

  const handleModeChange = (modeId) => {
    if (modeId === "EmergencyCall") {
      handleEmergencyCall();
      return;
    }

    onModeChange(modeId);
    navigation.navigate(modeId);
    setIsMenuOpen(false);
  };

  const handleEmergencyCall = () => {
    const phoneNumber = "tel:1234567890";
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert(
        "Error",
        "Unable to make a call. Please check your device settings."
      );
    });
  };

  return (
    <View style={styles.headerContainer}>
      {/* Location Box */}
      {renderLocation()}

      {/* Weather Info */}
      <View style={styles.weatherContainer}>
        {weather ? (
          <>
            <MaterialCommunityIcons
              name={weatherIconMap[weather.current.condition.text] || "weather-cloudy"}
              size={30}
              color={isDarkMode ? '#98FB98' : '#228B22'}  // Pale Green / Forest Green
            />
            <Text style={styles.temperature}>
              {Math.round(weather.current.temp_c)}°C
            </Text>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>

      {/* Hamburger Icon */}
      <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.hamburgerIcon}>
        <MaterialCommunityIcons name="menu" size={30} style={styles.hamburgerIconColor} />
      </TouchableOpacity>

      {/* Burger Menu Modal */}
      <Modal visible={isMenuOpen} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Option</Text>

            {transportModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.transportModeWrapper,
                  selectedMode === mode.id && styles.activeMode,
                ]}
                onPress={() => handleModeChange(mode.id)}
              >
                <MaterialCommunityIcons
                  name={mode.icon}
                  size={28}
                  color={selectedMode === mode.id ? "#007AFF" : "#333"}
                />
                <Text
                  style={[
                    styles.modeLabel,
                    selectedMode === mode.id && styles.activeModeLabel,
                  ]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({}); // Keep an empty style
export default Header;