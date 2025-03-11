import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import { auth, setupRecaptcha, signInWithPhoneNumber } from '../Firebase/firebase';



const LoginScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [verificationId, setVerificationId] = useState(null);
  const [code , setCode]=useState('')
  const [confirm , setConfirm]=useState(null)


  const handlePhoneNumberChange = (input) => {
    // Ensure the country code remains fixed
    if (!input.startsWith('+91')) {
      setPhoneNumber('+91' + input.replace(/^\+91/, '')); // Remove duplicate or incorrect +91
    } else {
      setPhoneNumber(input);
    }
  };


  const handleSendOtp = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    if (!/^\+\d{1,3}\s?\d{4,14}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Phone number must be in international format (e.g., +1 234 567 890).');
      return;
    }

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
       setConfirm(confirmation)
    } catch (error) {
      console.error('Error during OTP:', error);

    }
  };
  
  
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/Main-logo.png')} style={styles.logo} />
      </View>
      <View id="recaptcha-container" style={{ height: 1 }} />


      <View style={styles.subContainer}>
        {/* Input Container for Country Code and Phone Number */}
        <View style={styles.inputRow}>
          {/* Country Code Selector */}
          {/* <TouchableOpacity style={styles.countryCodeContainer}>
            <Text style={styles.countryCodeText}>+91</Text>
          </TouchableOpacity> */}

          {/* Phone Number Input */}
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter Your Phone Number"
            placeholderTextColor="#C1C1C1"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
          />
        </View>

        {/* Button */}
        <CustomButton title="Login" onPress={handleSendOtp} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF', // White background
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content at the top
  },
  logoContainer: {
    width: '100%', // Full width
    alignItems: 'center',
    marginTop: 40, // Margin from the top
  },
  logo: {
    width: 250, // Logo width
    height: 250, // Logo height
    resizeMode: 'contain', // Maintain aspect ratio
  },
  subContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%', // Full width
    height: '60%', // Adjust as needed
    backgroundColor: '#31473A', // Dark green background
    alignItems: 'center',
    borderTopLeftRadius: 30, // Rounded top-left corner
    borderTopRightRadius: 30, // Rounded top-right corner
  },
  inputRow: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    width: '90%',
    marginTop: '20%',
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF', // White border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50, // Fixed height for consistency
  },
  countryCodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  countryCodeText: {
    color: '#FFFFFF', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneInput: {
    flex: 1, // Take remaining space
    marginLeft: 10, // Space between country code and input
    color: '#FFFFFF', // White text color
    fontSize: 16,
  },
});

export default LoginScreen;
