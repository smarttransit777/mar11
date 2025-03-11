import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Text } from 'react-native';
import CustomButton from '../components/CustomButton';

const OtpVerificationScreen = ({navigation}) => {
  const [otp, setOtp] = useState(['', '', '', '']); // State for OTP digits

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Automatically move to the next input
    if (text && index < otp.length - 1) {
      inputs[index + 1].focus();
    }
  };

  const inputs = []; // Reference for inputs

  const handleVerifyOtp = () => {
    console.log('OTP Entered:', otp.join(''));
    navigation.navigate('HomeScreen')
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/Main-logo.png')} style={styles.logo} />
      </View>

      <View style={styles.subContainer}>
        {/* Title */}
        <Text style={styles.title}>Enter the OTP</Text>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="number-pad"
              maxLength={1} // Single character
              ref={(input) => (inputs[index] = input)} // Add to refs
            />
          ))}
        </View>

        {/* Verify Button */}
        <CustomButton title="Verify OTP" onPress={handleVerifyOtp} />
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
    paddingTop: 20, // Padding at the top
  },
  title: {
    color: '#FFFFFF', // White text color
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row', // Align inputs in a row
    justifyContent: 'space-between',
    width: '70%', // Adjust width as needed
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: '#FFFFFF', // White background
    width: 50, // Fixed width for each box
    height: 50, // Fixed height for each box
    borderRadius: 8, // Rounded corners
    textAlign: 'center', // Center align text
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black text color
    borderWidth: 1, // Border width
    borderColor: '#C1C1C1', // Light gray border
  },
});

export default OtpVerificationScreen;
