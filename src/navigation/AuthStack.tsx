import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Import screens (we'll create these next)
import SplashScreen from '../screens/auth/SplashScreen';
import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen';
import WelcomeCarouselScreen from '../screens/onboarding/WelcomeCarouselScreen';
import PhoneNumberScreen from '../screens/auth/PhoneNumberScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ProfileSetup1Screen from '../screens/auth/ProfileSetup1Screen';
import ProfileSetup2Screen from '../screens/auth/ProfileSetup2Screen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreen}
      />
      <Stack.Screen name="WelcomeCarousel" component={WelcomeCarouselScreen} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ProfileSetup1" component={ProfileSetup1Screen} />
      <Stack.Screen name="ProfileSetup2" component={ProfileSetup2Screen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
