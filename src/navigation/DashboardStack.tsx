// src/navigation/DashboardStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardStackParamList } from './types';

// Import screens
import DashboardHomeScreen from '../screens/dashboard/DashboardHomeScreen';
import AddVideoScreen from '../screens/dashboard/AddVideoScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={DashboardHomeScreen}
        options={
          {
            // Show tabs on home screen
          }
        }
      />
      <Stack.Screen
        name="AddVideo"
        component={AddVideoScreen}
        options={({ navigation }) => ({
          // This will be used by parent navigator
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          // This will be used by parent navigator
        })}
      />
    </Stack.Navigator>
  );
};

export default DashboardStack;
