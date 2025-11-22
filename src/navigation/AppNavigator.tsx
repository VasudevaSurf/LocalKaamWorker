import React, { useState, useEffect } from 'react';
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

// Main App - FIXED IMPORT
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading, user, hasSeenOnboarding } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // User not authenticated - show auth flow
          <>
            {!hasSeenOnboarding && (
              <>
                <Stack.Screen
                  name="LanguageSelection"
                  component={LanguageSelectionScreen}
                />
                <Stack.Screen
                  name="OnboardingCarousel"
                  component={OnboardingCarouselScreen}
                />
              </>
            )}
            <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
            <Stack.Screen
              name="OTPVerification"
              component={OTPVerificationScreen}
            />
          </>
        ) : !user?.profileComplete ? (
          // User authenticated but profile incomplete - show profile setup
          <>
            <Stack.Screen
              name="ProfileSetup1"
              component={ProfileSetup1Screen}
            />
            <Stack.Screen
              name="ProfileSetup2"
              component={ProfileSetup2Screen}
            />
          </>
        ) : (
          // User authenticated and profile complete - show main app
          <Stack.Screen name="MainApp" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
