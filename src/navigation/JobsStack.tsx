// src/navigation/JobsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobsStackParamList } from './types';

// Import screens
import JobsListScreen from '../screens/jobs/JobsListScreen';
import JobDetailsScreen from '../screens/jobs/JobDetailsScreen';
import SendResponseScreen from '../screens/jobs/SendResponseScreen';
import JobCompletionScreen from '../screens/jobs/JobCompletionScreen/JobCompletionScreen';
import PaymentConfirmationScreen from '../screens/jobs/PaymentConfirmationScreen';
import EnquiryDetailsScreen from '../screens/jobs/EnquiryDetailsScreen';

const Stack = createNativeStackNavigator<JobsStackParamList>();

const JobsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="JobsList" component={JobsListScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="SendResponse" component={SendResponseScreen} />
      <Stack.Screen name="JobCompletion" component={JobCompletionScreen} />
      <Stack.Screen
        name="PaymentConfirmation"
        component={PaymentConfirmationScreen}
      />
      <Stack.Screen name="EnquiryDetails" component={EnquiryDetailsScreen} />
    </Stack.Navigator>
  );
};

export default JobsStack;
