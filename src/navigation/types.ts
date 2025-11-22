import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  Splash: undefined;
  LanguageSelection: undefined;
  WelcomeCarousel: undefined;
  PhoneNumber: undefined;
  OTPVerification: { phoneNumber: string };
  ProfileSetup1: undefined;
  ProfileSetup2: undefined;
};

// Main Bottom Tabs
export type MainTabParamList = {
  Dashboard: undefined;
  Jobs: undefined;
  Earnings: undefined;
  Profile: undefined;
};

// Dashboard Stack
export type DashboardStackParamList = {
  DashboardHome: undefined;
  AddVideo: undefined;
  EditProfile: undefined;
};

// Jobs Stack
export type JobsStackParamList = {
  JobsList: undefined;
  JobDetails: { jobId: string };
  SendResponse: { jobId: string };
  CompleteJob: { jobId: string };
  PaymentConfirmation: { jobId: string; amount: number };
};

// Earnings Stack
export type EarningsStackParamList = {
  EarningsHome: undefined;
  TransactionHistory: undefined;
  TransactionDetails: { transactionId: string };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Help: undefined;
};

// Navigation Props
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
