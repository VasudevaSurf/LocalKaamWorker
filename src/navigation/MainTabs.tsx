import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabParamList } from './types';
import { COLORS, FONTS, getFigmaDimension } from '../utils';

// Import tab screens (we'll create these)
import DashboardStack from './DashboardStack';
import JobsStack from './JobsStack';
import EarningsStack from './EarningsStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

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
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
