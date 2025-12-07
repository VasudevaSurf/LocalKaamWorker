// src/navigation/MainTabs.tsx - COMPLETE UPDATED VERSION
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabParamList } from './types';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import SocketService from '../services/SocketService';
import { COLORS, FONTS, getFigmaDimension } from '../utils';
import * as api from '../services/api';

// Import tab screens
import DashboardStack from './DashboardStack';
import JobsStack from './JobsStack';
import EarningsStack from './EarningsStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Function to determine if tab bar should be visible
const getTabBarVisibility = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route);

  // List of screens where tab bar should be hidden
  const screensWithoutTabBar = [
    // Dashboard Stack
    'AddVideo',
    'EditProfile',

    // Jobs Stack
    'JobDetails',
    'SendResponse',
    'CompleteJob',
    'PaymentConfirmation',

    // Earnings Stack
    'TransactionHistory',
    'TransactionDetails',

    // Profile Stack
    'Settings',
    'Help',
  ];

  // Hide tab bar if current screen is in the list
  if (screensWithoutTabBar.includes(routeName)) {
    return 'none'; // This hides the tab bar
  }

  return 'flex'; // This shows the tab bar
};

const MainTabs = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const hasCheckedActiveJob = React.useRef(false);

  useEffect(() => {
    if (user?.id) {
      // Connect to socket
      const socket = SocketService.connect();
      SocketService.joinWorkerRoom(user.id);

      // Check for active jobs and navigate if found - RUNS ONLY ONCE
      if (!hasCheckedActiveJob.current) {
        const checkActiveJobs = async (retryCount = 0) => {
          try {
            hasCheckedActiveJob.current = true; // Mark checked to prevent double-runs
            const active = await api.getWorkerActiveRequests(user.id);
            if (active && active.length > 0) {
              // Navigate to Jobs tab first ensuring List is there
              navigation.navigate('MainApp', {
                screen: 'Jobs',
                params: { screen: 'JobsList' },
              } as never);

              // Then push details on top
              setTimeout(() => {
                navigation.navigate('MainApp', {
                  screen: 'Jobs',
                  params: {
                    screen: 'JobDetails',
                    params: { jobId: active[0]._id },
                  },
                } as never);
              }, 100);
            }
          } catch (error) {
            console.error(
              `[MainTabs] Error checking active jobs (Attempt ${
                retryCount + 1
              }):`,
              error,
            );
            // Retry logic for network failures on launch
            if (retryCount < 3) {
              const timeout = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
              console.log(`[MainTabs] Retrying in ${timeout}ms...`);
              hasCheckedActiveJob.current = false; // Allow retry
              setTimeout(() => {
                if (!hasCheckedActiveJob.current) {
                  // Double check
                  checkActiveJobs(retryCount + 1);
                }
              }, timeout);
            }
          }
        };

        // Small initial delay to allow network/socket to stabilize
        setTimeout(() => checkActiveJobs(), 1000);
      }

      // Listen for new requests
      SocketService.onNewRequest(data => {
        console.log('[MainTabs] New request received:', data);
        Alert.alert(
          'New Job Alert! 🔔',
          `New ${data.serviceType} job in ${
            data.location?.city || 'your area'
          }`,
          [
            { text: 'Dismiss', style: 'cancel' },
            {
              text: 'View',
              onPress: () => {
                // Navigate to Jobs tab
                navigation.navigate('MainApp', {
                  screen: 'Jobs',
                } as never);
              },
            },
          ],
        );
      });

      return () => {
        SocketService.offNewRequest();
      };
    }
  }, [user?.id]); // Only re-run if user ID changes (login/logout)

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarLabelStyle: {
          fontFamily: FONTS.medium,
          fontSize: getFigmaDimension(12),
          marginBottom: getFigmaDimension(4),
        },
        tabBarStyle: {
          height: getFigmaDimension(60),
          paddingTop: getFigmaDimension(8),
          paddingBottom: getFigmaDimension(8),
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
          tabBarStyle: {
            display: getTabBarVisibility(route),
            height: getFigmaDimension(60),
            paddingTop: getFigmaDimension(8),
            paddingBottom: getFigmaDimension(8),
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          },
        })}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsStack}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Icon name="briefcase" size={size} color={color} />
          ),
          tabBarStyle: {
            display: getTabBarVisibility(route),
            height: getFigmaDimension(60),
            paddingTop: getFigmaDimension(8),
            paddingBottom: getFigmaDimension(8),
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          },
        })}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsStack}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" size={size} color={color} />
          ),
          tabBarStyle: {
            display: getTabBarVisibility(route),
            height: getFigmaDimension(60),
            paddingTop: getFigmaDimension(8),
            paddingBottom: getFigmaDimension(8),
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
          tabBarStyle: {
            display: getTabBarVisibility(route),
            height: getFigmaDimension(60),
            paddingTop: getFigmaDimension(8),
            paddingBottom: getFigmaDimension(8),
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
