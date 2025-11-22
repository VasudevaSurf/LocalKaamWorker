import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardStackParamList } from './types';

// Import screens (we'll create these)
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
      <Stack.Screen name="DashboardHome" component={DashboardHomeScreen} />
      <Stack.Screen name="AddVideo" component={AddVideoScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default DashboardStack;
