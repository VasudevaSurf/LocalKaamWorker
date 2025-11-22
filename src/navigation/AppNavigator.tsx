import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen/SplashScreen';
import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen/LanguageSelectionScreen';
import OnboardingCarouselScreen from '../screens/onboarding/WelcomeCarouselScreen/WelcomeCarouselScreen';
import PhoneNumberScreen from '../screens/auth/PhoneNumberScreen/PhoneNumberScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen/OTPVerificationScreen';
import ProfileSetup1Screen from '../screens/auth/ProfileSetup1Screen/ProfileSetup1Screen';
import ProfileSetup2Screen from '../screens/auth/ProfileSetup2Screen/ProfileSetup2Screen';

// Main App
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* Always show splash first */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Auth Flow */}
        <Stack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
        />
        <Stack.Screen
          name="OnboardingCarousel"
          component={OnboardingCarouselScreen}
        />
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
        />
        <Stack.Screen name="ProfileSetup1" component={ProfileSetup1Screen} />
        <Stack.Screen name="ProfileSetup2" component={ProfileSetup2Screen} />

        {/* Main App */}
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
