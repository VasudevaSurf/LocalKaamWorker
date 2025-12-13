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
import NotificationService from '../services/NotificationService';

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

  // Notification Handling
  const navigationRef = React.useRef<any>(null);
  const [pendingNotification, setPendingNotification] = useState<any>(null);

  // 1. Check Initial Notification (Quit State) ON MOUNT
  useEffect(() => {
    NotificationService.checkInitialNotification(remoteMessage => {
      console.log(
        '[AppNavigator] Queuing initial notification:',
        remoteMessage,
      );
      setPendingNotification(remoteMessage);
    });
  }, []);

  // 2. Handle Notification Navigation (Foreground/Background/Pending)
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const handleNotification = (remoteMessage: any) => {
      console.log('[AppNavigator] Handling notification:', remoteMessage);
      const { requestId, type } = remoteMessage.data || {};

      if ((type === 'NEW_REQUEST' || requestId) && navigationRef.current) {
        // Navigate to Jobs List with highlight logic
        const targetScreen =
          type === 'QUOTE_ACCEPTED' ? 'JobDetails' : 'JobsList';
        const params =
          type === 'QUOTE_ACCEPTED'
            ? { requestId: requestId }
            : { highlightJobId: requestId };

        console.log(
          `[AppNavigator] Navigating to ${targetScreen} with params:`,
          params,
        );

        if (type === 'QUOTE_ACCEPTED' || type === 'JOB_CANCELLED_CUSTOMER') {
          // Both go to JobDetails
          navigationRef.current?.navigate('MainApp', {
            screen: 'Jobs', // Or Dashboard? JobsStack usually has JobDetails
            params: {
              screen: 'JobDetails',
              params: { jobId: requestId },
            },
          });
        } else if (type === 'NEW_RATING') {
          navigationRef.current?.navigate('MainApp', {
            screen: 'Profile', // Or Dashboard? JobsStack usually has JobDetails
          });
        } else {
          navigationRef.current?.navigate('MainApp', {
            screen: 'Jobs',
            params: {
              screen: 'JobsList',
              params: { highlightJobId: requestId },
            },
          });
        }
      }
    };

    // Process Pending Notification if any
    if (pendingNotification) {
      console.log('[AppNavigator] Processing pending notification');
      handleNotification(pendingNotification);
      setPendingNotification(null);
    }

    // 2. Background State
    const unsubscribeBackground =
      NotificationService.onNotificationOpenedApp(handleNotification);

    // 3. Foreground State
    const unsubscribeForeground =
      NotificationService.setupForegroundHandler(handleNotification);

    return () => {
      unsubscribeBackground();
      unsubscribeForeground();
    };
  }, [isAuthenticated, isLoading, pendingNotification]); // Re-run when these change

  if (isLoading || showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
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
