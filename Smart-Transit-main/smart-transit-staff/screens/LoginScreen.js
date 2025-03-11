import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase'; // Ensure this imports your Firebase configuration

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Validation Error', 'Please enter both username and password.');
      return;
    }

    try {
      // Query Firestore to find the matching staff name and bus number
      const busesRef = collection(db, 'buses');
      const q = query(busesRef, where('staff_name', '==', username), where('bus_number', '==', password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Valid credentials
        Alert.alert('Login Successful', `Welcome, ${username}!`);
        navigation.navigate('Location',{ busNumber: password }); // Navigate to the Location Screen
      } else {
        // Invalid credentials
        Alert.alert('Login Failed', 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred while logging in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Staff Name"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Bus Number"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
