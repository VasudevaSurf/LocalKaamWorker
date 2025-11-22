import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EarningsStackParamList } from './types';

// Import screens
import EarningsHomeScreen from '../screens/earnings/EarningsHomeScreen';
import TransactionHistoryScreen from '../screens/earnings/TransactionHistoryScreen';
import TransactionDetailsScreen from '../screens/earnings/TransactionDetailsScreen';

const Stack = createNativeStackNavigator<EarningsStackParamList>();

const EarningsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="EarningsHome" component={EarningsHomeScreen} />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default EarningsStack;
