import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';
import auth from '@react-native-firebase/auth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from '../store/slices/authSlice';
import {
  setUser,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  clearUser,
} from '../store/slices/userSlice';

interface User {
  id: string;
  name: string;
  phoneNumber: string; // Changed from phone to phoneNumber to match backend
  skill: string;
  profileComplete: boolean;
  profileImage?: string;
  profileVideo?: string;
  city?: {
    name: string;
    state: string;
  };
  experience?: {
    label: string;
    value: string;
  };
  workVideos?: {
    videoUrl: string;
    thumbnailUrl?: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    createdAt: string;
  }[];
}

// ... (AuthContextType remains mostly the same, but check usages)

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  uploadUserImage: (imageUri: string) => Promise<string>;
  uploadUserVideo: (
    videoUri: string,
    metadata?: {
      title: string;
      description: string;
      category: string;
      tags: string[];
    },
  ) => Promise<string>;
  checkAuthStatus: () => Promise<boolean>;
  setOnboardingComplete: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const { currentUser: user } = useAppSelector(state => state.user);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
    // Refresh profile on app start if user is logged in
    if (user?.phoneNumber) {
      refreshUserProfile();
    }
  }, []);

  const refreshUserProfile = async () => {
    try {
      if (user?.phoneNumber) {
        const updatedUser = await api.getProfile(user.phoneNumber);
        if (updatedUser) {
          dispatch(setUser(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem(
        '@onboarding_complete',
      );
      setHasSeenOnboarding(onboardingComplete === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    // Redux Persist handles this automatically
    return isAuthenticated;
  };

  const setOnboardingComplete = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error setting onboarding complete:', error);
    }
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    try {
      dispatch(loginStart());
      // Fetch user profile from backend
      try {
        // Ensure phone number has +91 prefix if missing (assuming India)
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        console.log(
          `[AuthContext] Original Phone: '${phone}', Formatted: '${formattedPhone}'`,
        );

        const existingUser = await api.getProfile(formattedPhone);
        if (existingUser) {
          console.log('User found:', existingUser);
          dispatch(setUser(existingUser));
          dispatch(loginSuccess('mock_token_123'));
          return true;
        }
      } catch (error: any) {
        // If 404, it means user doesn't exist, so we proceed to create new
        if (error.response && error.response.status === 404) {
          console.log('User not found in DB, proceeding to setup new profile.');
        } else {
          console.error('Error fetching profile:', error);
        }
      }

      const userData: User = {
        id: '123',
        name: '',
        phoneNumber: phone,
        skill: '',
        profileComplete: false,
      };

      dispatch(loginSuccess('mock_token_123'));
      dispatch(setUser(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      dispatch(loginFailure('Login failed'));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      dispatch(logoutAction());
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) return;
      dispatch(updateUserStart());

      // Call Backend API
      const updatedProfile = await api.updateProfile({
        ...userData,
        phoneNumber: user.phoneNumber,
        firebaseUid: auth().currentUser?.uid || '',
      });

      dispatch(updateUserSuccess(userData));
    } catch (error) {
      console.error('Update user error:', error);
      dispatch(updateUserFailure('Update failed'));
      throw error;
    }
  };

  const uploadUserImage = async (imageUri: string): Promise<string> => {
    try {
      if (!user) throw new Error('User not logged in');
      const response = await api.uploadImage(imageUri, user.phoneNumber);

      // Update Redux state with new image URL
      dispatch(updateUserSuccess({ profileImage: response.imageUrl }));

      return response.imageUrl;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  };

  const uploadUserVideo = async (
    videoUri: string,
    metadata?: {
      title: string;
      description: string;
      category: string;
      tags: string[];
    },
  ): Promise<string> => {
    try {
      if (!user) throw new Error('User not logged in');
      const response = await api.uploadVideo(
        videoUri,
        user.phoneNumber,
        metadata,
      );

      // Update Redux state with new videos list
      if (response.workVideos) {
        dispatch(updateUserSuccess({ workVideos: response.workVideos }));
      }

      return response.videoUrl;
    } catch (error) {
      console.error('Upload video error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        hasSeenOnboarding,
        login,
        logout,
        updateUser,
        uploadUserImage,
        uploadUserVideo,
        checkAuthStatus,
        setOnboardingComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
