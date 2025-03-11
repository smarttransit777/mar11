import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import OtpVerificationScreen from './screens/OtpVerificationScreen';
import HomeScreen from './screens/HomeScreen';
import BusStopsScreen from './screens/BusStopScreen';
import ComplaintScreen from './screens/ComplaintScreen';
import MapScreen from './screens/MapScreen';
import LoadingScreen from './screens/LoadingScreen';
import { ThemeProvider } from './screens/ThemeContext'; // Import ThemeProvider

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="loading">
          {/* <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }} // Hides header for login
          />
          <Stack.Screen
            name="OtpVerification"
            component={OtpVerificationScreen}
            options={{ headerShown: false }} // Adds a title for OTP screen
          /> */}

          <Stack.Screen
            name="loading"
            component={LoadingScreen}
            options={{ headerShown: false }} // Adds a title for OTP screen
          />

          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }} // Adds a title for OTP screen
          />
          <Stack.Screen
            name="BusStop"
            component={BusStopsScreen}
            options={{ headerShown: false }} // Adds a title for OTP screen
          />
          <Stack.Screen
            name="Complaint"
            component={ComplaintScreen}
            options={{ headerShown: false }} // Adds a title for OTP screen
          />
          <Stack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{ headerShown: false }} // Adds a title for OTP screen
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;