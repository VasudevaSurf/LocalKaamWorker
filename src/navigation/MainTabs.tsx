// src/navigation/MainTabs.tsx - COMPLETE UPDATED VERSION
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabParamList } from './types';
import { COLORS, FONTS, getFigmaDimension } from '../utils';

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
