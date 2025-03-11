import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Header from '../components/Header';
import * as Location from 'expo-location';
import { db } from '../Firebase/firebase'; // Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods
import axios from 'axios';  

const ComplaintScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [selectedMode, setSelectedMode] = useState('Complaint');

  const [weather, setWeather] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

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
          Alert.alert('Location Permission Denied', 'Unable to fetch location without permission.');
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
        console.error('Error fetching location or weather:', error);
      }
    };

    fetchLocationAndWeather();
  }, []);

  const handleSubmitComplaint = async () => {
    if (name.trim() && mobile.trim() && vehicleNumber.trim() && complaintText.trim()) {
      try {
        await addDoc(collection(db, 'complaint'), {
          name,
          mobile,
          vehicleNumber,
          complaintText,
          timestamp: new Date().toISOString(),
        });

        Alert.alert('Complaint Submitted', 'Your complaint has been submitted successfully.');
        setName('');
        setMobile('');
        setVehicleNumber('');
        setComplaintText('');
      } catch (error) {
        Alert.alert('Error', 'Failed to submit the complaint.');
        console.error('Error saving complaint:', error);
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header
        weather={weather}
        locationDetails={locationDetails}
        weatherIconMap={weatherIconMap}
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
        navigation={navigation}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Submit Your Complaint</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Offensive vehicle number"
          placeholderTextColor="#888"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
        />

        <TextInput
          style={[styles.input, { height: 150 }]}
          placeholder="Enter your complaint"
          placeholderTextColor="#888"
          multiline
          value={complaintText}
          onChangeText={setComplaintText}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitComplaint}>
          <Text style={styles.submitButtonText}>Submit Complaint</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop:40
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#34A853',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComplaintScreen;
